from __future__ import annotations

from datetime import date
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import DecimalField, ExpressionWrapper, F, Sum
from django.utils import timezone

from cuts.models import MonthlyCut
from expenses.models import Expense
from sales.models import Sale


def is_period_closed_for_date(target_date: date) -> bool:
    return MonthlyCut.objects.filter(cutoff_date__gte=target_date, status=MonthlyCut.Status.COMPLETED).exists()


@transaction.atomic
def execute_monthly_cut(*, cutoff_date: date, actor, notes: str = "") -> MonthlyCut:
    period = cutoff_date.strftime("%Y-%m")
    if MonthlyCut.objects.filter(period=period, cutoff_date=cutoff_date, status=MonthlyCut.Status.COMPLETED).exists():
        raise ValidationError("Ya existe un corte mensual para este periodo y fecha.")

    started_at = timezone.now()
    cut = MonthlyCut.objects.create(
        period=period,
        cutoff_date=cutoff_date,
        closed_by=actor,
        notes=notes,
        status=MonthlyCut.Status.RUNNING,
        started_at=started_at,
        finished_at=started_at,
    )

    sales_qs = Sale.objects.select_for_update().filter(
        sold_at__date__lte=cutoff_date,
        is_closed_by_cut=False,
    )
    expenses_qs = Expense.objects.select_for_update().filter(
        spent_at__date__lte=cutoff_date,
        is_closed_by_cut=False,
    )

    now = timezone.now()
    sales_qs.update(is_closed_by_cut=True, closed_by_cut=cut, closed_at=now)
    expenses_qs.update(is_closed_by_cut=True, closed_by_cut=cut, closed_at=now)

    cut.status = MonthlyCut.Status.COMPLETED
    cut.finished_at = now
    cut.closed_at = now
    cut.save(update_fields=["status", "finished_at", "closed_at"])
    return cut


def _money_or_zero(value) -> Decimal:
    return value if value is not None else Decimal("0.00")


def build_monthly_cut_report(*, cut: MonthlyCut) -> dict:
    sale_total_expr = ExpressionWrapper(F("unit_sale_price") * F("quantity"), output_field=DecimalField(max_digits=14, decimal_places=2))
    capital_expr = ExpressionWrapper(F("unit_cost_price") * F("quantity"), output_field=DecimalField(max_digits=14, decimal_places=2))
    store_profit_expr = ExpressionWrapper((F("unit_wholesale_reference_price") - F("unit_cost_price")) * F("quantity"), output_field=DecimalField(max_digits=14, decimal_places=2))
    vendor_profit_expr = ExpressionWrapper((F("unit_sale_price") - F("unit_wholesale_reference_price")) * F("quantity"), output_field=DecimalField(max_digits=14, decimal_places=2))

    enabled_sales = Sale.objects.select_related("wholesaler", "product", "vendor").filter(closed_by_cut=cut, is_active=True)
    disabled_sales = Sale.objects.select_related("wholesaler", "product", "vendor").filter(closed_by_cut=cut, is_active=False)
    cut_expenses = Expense.objects.filter(closed_by_cut=cut)

    total_income = _money_or_zero(enabled_sales.aggregate(total=Sum(sale_total_expr))["total"])
    invested_capital = _money_or_zero(enabled_sales.aggregate(total=Sum(capital_expr))["total"])
    store_profit = _money_or_zero(enabled_sales.aggregate(total=Sum(store_profit_expr))["total"])
    vendor_profit = _money_or_zero(enabled_sales.aggregate(total=Sum(vendor_profit_expr))["total"])
    expenses = _money_or_zero(cut_expenses.aggregate(total=Sum("amount"))["total"])
    capital = invested_capital
    real_net = store_profit - expenses

    by_wholesaler = []
    wholesaler_keys = sorted({(s.wholesaler_id or 0, s.wholesaler.name if s.wholesaler else "Sin mayorista") for s in enabled_sales}, key=lambda item: item[1])
    for wholesaler_id, wholesaler_name in wholesaler_keys:
        grouped = enabled_sales.filter(wholesaler_id=wholesaler_id if wholesaler_id else None)
        by_wholesaler.append(
            {
                "wholesaler_name": wholesaler_name,
                "sales_count": grouped.count(),
                "income": _money_or_zero(grouped.aggregate(total=Sum(sale_total_expr))["total"]),
                "capital": _money_or_zero(grouped.aggregate(total=Sum(capital_expr))["total"]),
                "store_profit": _money_or_zero(grouped.aggregate(total=Sum(store_profit_expr))["total"]),
                "wholesaler_profit": _money_or_zero(grouped.aggregate(total=Sum(vendor_profit_expr))["total"]),
            }
        )

    enabled_details = [
        {
            "sold_at": sale.sold_at,
            "wholesaler_name": sale.wholesaler.name if sale.wholesaler else "Sin mayorista",
            "product_name": sale.product.name,
            "quantity": sale.quantity,
            "unit_cost_price": sale.unit_cost_price,
            "unit_wholesale_reference_price": sale.unit_wholesale_reference_price,
            "unit_sale_price": sale.unit_sale_price,
            "store_profit": sale.store_profit,
            "vendor_profit": sale.vendor_profit,
            "sale_total": sale.unit_sale_price * sale.quantity,
        }
        for sale in enabled_sales.order_by("wholesaler__name", "sold_at")
    ]

    disabled_details = [
        {
            "sold_at": sale.sold_at,
            "wholesaler_name": sale.wholesaler.name if sale.wholesaler else "Sin mayorista",
            "product_name": sale.product.name,
            "quantity": sale.quantity,
            "unit_cost_price": sale.unit_cost_price,
            "unit_wholesale_reference_price": sale.unit_wholesale_reference_price,
            "unit_sale_price": sale.unit_sale_price,
            "store_profit": sale.store_profit,
            "vendor_profit": sale.vendor_profit,
            "sale_total": sale.unit_sale_price * sale.quantity,
        }
        for sale in disabled_sales.order_by("wholesaler__name", "sold_at")
    ]

    expenses_detail = [
        {
            "spent_at": expense.spent_at,
            "concept": expense.concept,
            "amount": expense.amount,
        }
        for expense in cut_expenses.order_by("spent_at", "id")
    ]

    return {
        "summary": {
            "total_income": total_income,
            "invested_capital": invested_capital,
            "store_profit": store_profit,
            "vendor_profit": vendor_profit,
            "capital": capital,
            "expenses": expenses,
            "real_net": real_net,
        },
        "wholesaler_performance": by_wholesaler,
        "expenses_detail": expenses_detail,
        "enabled_sales_detail": enabled_details,
        "disabled_sales_detail": disabled_details,
    }
