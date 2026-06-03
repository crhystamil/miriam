import logging
from decimal import Decimal

from expenses.models import Expense


logger = logging.getLogger(__name__)


def register_expense(*, scope: str, concept: str, amount: Decimal, spent_at, vendor=None, notes: str = "") -> Expense:
    expense = Expense.objects.create(
        scope=scope,
        vendor=vendor,
        concept=concept,
        amount=amount,
        spent_at=spent_at,
        notes=notes,
    )
    logger.info("Gasto registrado", extra={"expense_id": expense.id, "scope": scope})
    return expense
