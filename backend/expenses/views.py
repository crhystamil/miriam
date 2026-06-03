from rest_framework.viewsets import ModelViewSet
from django.utils.dateparse import parse_date

from expenses.models import Expense
from expenses.serializers import ExpenseSerializer


class ExpenseViewSet(ModelViewSet):
    queryset = Expense.objects.select_related("vendor").all().order_by("-spent_at")
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.filter(is_closed_by_cut=False)
        spent_from = self.request.query_params.get("from")
        spent_to = self.request.query_params.get("to")
        scope = self.request.query_params.get("scope")

        if user.role == "admin":
            pass
        else:
            queryset = queryset.filter(vendor=user)

        if spent_from:
            parsed_from = parse_date(spent_from)
            if parsed_from:
                queryset = queryset.filter(spent_at__date__gte=parsed_from)
        if spent_to:
            parsed_to = parse_date(spent_to)
            if parsed_to:
                queryset = queryset.filter(spent_at__date__lte=parsed_to)
        if scope in {Expense.Scope.STORE, Expense.Scope.VENDOR}:
            queryset = queryset.filter(scope=scope)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "vendor":
            serializer.save(vendor=user, scope=Expense.Scope.VENDOR)
            return
        serializer.save()
