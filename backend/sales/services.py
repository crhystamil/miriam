import logging
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from core.models import User
from products.models import Product
from sales.models import Purchase, Sale, Wholesaler


logger = logging.getLogger(__name__)


@transaction.atomic
def register_purchase(*, product_id: int, quantity: int, unit_cost: Decimal, notes: str = "") -> Purchase:
    if quantity <= 0:
        raise ValidationError("La cantidad de compra debe ser positiva.")

    product = Product.objects.select_for_update().get(pk=product_id)
    purchase = Purchase.objects.create(
        product=product,
        quantity=quantity,
        remaining=quantity,
        unit_cost=unit_cost,
        notes=notes,
    )
    product.stock += quantity
    product.cost_price = unit_cost
    product.save(update_fields=["stock", "cost_price", "updated_at"])

    logger.info("Compra registrada", extra={"purchase_id": purchase.id, "product_id": product.id, "quantity": quantity})
    return purchase


@transaction.atomic
def register_sale(
    *,
    product_id: int,
    vendor_id: int,
    wholesaler_id: int,
    unit_sale_price: Decimal,
    notes: str = "",
) -> Sale:
    product = Product.objects.select_for_update().get(pk=product_id)
    vendor = User.objects.select_for_update().get(pk=vendor_id)
    wholesaler = Wholesaler.objects.select_for_update().get(pk=wholesaler_id, is_active=True)

    if vendor.role != User.Role.VENDOR:
        raise ValidationError("La venta debe pertenecer a un vendedor.")

    fifo_lot = (
        Purchase.objects.select_for_update()
        .filter(product=product, remaining__gt=0)
        .order_by("purchased_at")
        .first()
    )
    if fifo_lot is None:
        raise ValidationError("No hay stock disponible para este producto.")

    sale = Sale.objects.create(
        product=product,
        vendor=vendor,
        wholesaler=wholesaler,
        purchase=fifo_lot,
        quantity=1,
        unit_sale_price=unit_sale_price,
        unit_wholesale_reference_price=product.wholesale_reference_price,
        unit_cost_price=fifo_lot.unit_cost,
        notes=notes,
    )
    fifo_lot.remaining -= 1
    fifo_lot.save(update_fields=["remaining"])
    product.stock -= 1
    product.save(update_fields=["stock", "updated_at"])

    logger.info(
        "Venta registrada",
        extra={
            "sale_id": sale.id,
            "product_id": product.id,
            "vendor_id": vendor.id,
            "wholesaler_id": wholesaler.id,
            "purchase_id": fifo_lot.id,
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
    product.stock += sale.quantity
    product.save(update_fields=["stock", "updated_at"])

    if sale.purchase_id:
        fifo_lot = Purchase.objects.select_for_update().get(pk=sale.purchase_id)
        fifo_lot.remaining += sale.quantity
        fifo_lot.save(update_fields=["remaining"])

    sale.is_active = False
    sale.save(update_fields=["is_active"])
    return sale
