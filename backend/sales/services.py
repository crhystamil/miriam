import logging
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from core.models import User
from products.models import Product
from sales.models import InventoryAdjustment, InventoryAdjustmentLot, Purchase, Sale, SaleCostAllocation, Wholesaler


logger = logging.getLogger(__name__)


def get_active_lot_remaining_total(*, product: Product) -> int:
    return sum(
        Purchase.objects.filter(product=product, remaining__gt=0).values_list("remaining", flat=True)
    )


def get_stock_lot_mismatch(*, product: Product) -> dict | None:
    lot_total = get_active_lot_remaining_total(product=product)
    if product.stock == lot_total:
        return None
    return {
        "product_id": product.id,
        "product_sku": product.sku,
        "product_stock": product.stock,
        "lot_remaining_total": lot_total,
        "difference": product.stock - lot_total,
    }


@transaction.atomic
def reconcile_product_stock_lots(*, product_id: int) -> Purchase | None:
    product = Product.objects.select_for_update().get(pk=product_id)
    lot_total = get_active_lot_remaining_total(product=product)
    difference = product.stock - lot_total
    if difference == 0:
        return None
    if difference < 0:
        product.stock = lot_total
        product.save(update_fields=["stock", "updated_at"])
        return None
    if product.cost_price <= Decimal("0.00"):
        raise ValidationError("No se puede reconciliar stock sin costo referencial positivo.")
    return Purchase.objects.create(
        product=product,
        quantity=difference,
        remaining=difference,
        unit_cost=product.cost_price,
        notes="Lote inicial de reconciliacion de stock existente.",
    )


@transaction.atomic
def register_inventory_adjustment(
    *,
    product_id: int,
    actor: User,
    direction: str,
    quantity: int,
    reason: str,
    unit_cost: Decimal | None = None,
) -> InventoryAdjustment:
    if actor.role != User.Role.ADMIN:
        raise ValidationError("Solo administradores pueden ajustar inventario.")
    if quantity <= 0:
        raise ValidationError("La cantidad ajustada debe ser positiva.")
    if not reason.strip():
        raise ValidationError("El motivo del ajuste es obligatorio.")

    product = Product.objects.select_for_update().get(pk=product_id)

    if direction == InventoryAdjustment.Direction.INCREASE:
        if unit_cost is None or unit_cost <= Decimal("0.00"):
            raise ValidationError("El costo unitario es obligatorio para incrementos de inventario.")
        purchase = Purchase.objects.create(
            product=product,
            quantity=quantity,
            remaining=quantity,
            unit_cost=unit_cost,
            notes=f"Ajuste positivo: {reason}",
        )
        product.stock += quantity
        product.save(update_fields=["stock", "updated_at"])
        adjustment = InventoryAdjustment.objects.create(
            product=product,
            direction=direction,
            quantity=quantity,
            unit_cost=unit_cost,
            reason=reason,
            actor=actor,
        )
        InventoryAdjustmentLot.objects.create(
            adjustment=adjustment,
            purchase=purchase,
            quantity=quantity,
            unit_cost=unit_cost,
        )
        return adjustment

    if direction != InventoryAdjustment.Direction.DECREASE:
        raise ValidationError("Direccion de ajuste invalida.")

    fifo_lots = list(
        Purchase.objects.select_for_update()
        .filter(product=product, remaining__gt=0)
        .order_by("purchased_at")
    )
    if sum(lot.remaining for lot in fifo_lots) < quantity:
        raise ValidationError("No hay stock suficiente para ajustar inventario.")

    remaining_to_allocate = quantity
    affected_lots = []
    total_cost = Decimal("0.00")
    for lot in fifo_lots:
        if remaining_to_allocate == 0:
            break
        affected_quantity = min(lot.remaining, remaining_to_allocate)
        affected_lots.append((lot, affected_quantity, lot.unit_cost))
        total_cost += lot.unit_cost * affected_quantity
        remaining_to_allocate -= affected_quantity

    average_unit_cost = (total_cost / quantity).quantize(Decimal("0.01"))
    adjustment = InventoryAdjustment.objects.create(
        product=product,
        direction=direction,
        quantity=quantity,
        unit_cost=average_unit_cost,
        reason=reason,
        actor=actor,
    )
    for lot, affected_quantity, affected_unit_cost in affected_lots:
        InventoryAdjustmentLot.objects.create(
            adjustment=adjustment,
            purchase=lot,
            quantity=affected_quantity,
            unit_cost=affected_unit_cost,
        )
        lot.remaining -= affected_quantity
        lot.save(update_fields=["remaining"])

    product.stock -= quantity
    product.save(update_fields=["stock", "updated_at"])
    return adjustment


@transaction.atomic
def register_purchase(*, product_id: int, quantity: int, unit_cost: Decimal, notes: str = "") -> Purchase:
    if quantity <= 0:
        raise ValidationError("La cantidad de compra debe ser positiva.")
    if unit_cost <= Decimal("0.00"):
        raise ValidationError("El costo unitario de compra debe ser mayor a cero.")

    product = Product.objects.select_for_update().get(pk=product_id)
    purchase = Purchase.objects.create(
        product=product,
        quantity=quantity,
        remaining=quantity,
        unit_cost=unit_cost,
        notes=notes,
    )
    product.stock += quantity
    product.save(update_fields=["stock", "updated_at"])

    logger.info("Compra registrada", extra={"purchase_id": purchase.id, "product_id": product.id, "quantity": quantity})
    return purchase


@transaction.atomic
def register_sale(
    *,
    product_id: int,
    vendor_id: int,
    wholesaler_id: int,
    unit_sale_price: Decimal,
    quantity: int = 1,
    notes: str = "",
) -> Sale:
    if quantity <= 0:
        raise ValidationError("La cantidad de venta debe ser positiva.")

    product = Product.objects.select_for_update().get(pk=product_id)
    vendor = User.objects.select_for_update().get(pk=vendor_id)
    wholesaler = Wholesaler.objects.select_for_update().get(pk=wholesaler_id, is_active=True)

    if vendor.role != User.Role.VENDOR:
        raise ValidationError("La venta debe pertenecer a un vendedor.")

    fifo_lots = list(
        Purchase.objects.select_for_update()
        .filter(product=product, remaining__gt=0)
        .order_by("purchased_at")
    )
    if sum(lot.remaining for lot in fifo_lots) < quantity:
        raise ValidationError("No hay stock disponible para este producto.")

    allocations = []
    remaining_to_allocate = quantity
    total_cost = Decimal("0.00")
    for lot in fifo_lots:
        if remaining_to_allocate == 0:
            break
        allocated_quantity = min(lot.remaining, remaining_to_allocate)
        allocations.append((lot, allocated_quantity, lot.unit_cost))
        total_cost += lot.unit_cost * allocated_quantity
        remaining_to_allocate -= allocated_quantity

    first_lot = allocations[0][0]
    unit_cost_price = (total_cost / quantity).quantize(Decimal("0.01"))

    sale = Sale.objects.create(
        product=product,
        vendor=vendor,
        wholesaler=wholesaler,
        purchase=first_lot,
        quantity=quantity,
        unit_sale_price=unit_sale_price,
        unit_wholesale_reference_price=product.wholesale_reference_price,
        unit_cost_price=unit_cost_price,
        notes=notes,
    )

    for lot, allocated_quantity, unit_cost in allocations:
        SaleCostAllocation.objects.create(
            sale=sale,
            purchase=lot,
            quantity=allocated_quantity,
            unit_cost=unit_cost,
        )
        lot.remaining -= allocated_quantity
        lot.save(update_fields=["remaining"])

    product.stock -= quantity
    product.save(update_fields=["stock", "updated_at"])

    logger.info(
        "Venta registrada",
        extra={
            "sale_id": sale.id,
            "product_id": product.id,
            "vendor_id": vendor.id,
            "wholesaler_id": wholesaler.id,
            "purchase_id": first_lot.id,
            "unit_cost_price": str(sale.unit_cost_price),
        },
    )
    return sale


@transaction.atomic
def deactivate_sale(*, sale: Sale, actor: User) -> Sale:
    if not sale.is_active:
        return sale

    if actor.role not in {User.Role.ADMIN, User.Role.VENDOR}:
        raise ValidationError("No tiene permisos para deshabilitar esta venta.")

    if actor.role == User.Role.VENDOR and sale.vendor_id != actor.id:
        raise ValidationError("Solo puede deshabilitar sus propias ventas.")

    product = Product.objects.select_for_update().get(pk=sale.product_id)
    allocations = list(sale.cost_allocations.select_related("purchase"))
    if allocations:
        total_cost = Decimal("0.00")
        for allocation in allocations:
            allocation.purchase.remaining += allocation.quantity
            allocation.purchase.save(update_fields=["remaining"])
            total_cost += allocation.unit_cost * allocation.quantity
    elif sale.purchase_id:
        fifo_lot = Purchase.objects.select_for_update().get(pk=sale.purchase_id)
        fifo_lot.remaining += sale.quantity
        fifo_lot.save(update_fields=["remaining"])
        total_cost = sale.unit_cost_price * sale.quantity
        allocations = [SaleCostAllocation(sale=sale, purchase=fifo_lot, quantity=sale.quantity, unit_cost=sale.unit_cost_price)]
    else:
        total_cost = sale.unit_cost_price * sale.quantity

    product.stock += sale.quantity
    product.save(update_fields=["stock", "updated_at"])

    adjustment = InventoryAdjustment.objects.create(
        product=product,
        direction=InventoryAdjustment.Direction.REVERSAL,
        quantity=sale.quantity,
        unit_cost=(total_cost / sale.quantity).quantize(Decimal("0.01")),
        reason="Venta deshabilitada",
        actor=actor,
        source_sale=sale,
    )
    for allocation in allocations:
        InventoryAdjustmentLot.objects.create(
            adjustment=adjustment,
            purchase=allocation.purchase,
            quantity=allocation.quantity,
            unit_cost=allocation.unit_cost,
        )

    sale.is_active = False
    sale.save(update_fields=["is_active"])
    return sale
