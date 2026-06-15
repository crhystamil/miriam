from django.contrib.auth import authenticate, login, logout
from datetime import timedelta
from decimal import Decimal
from django.conf import settings
from django.utils.dateparse import parse_date
from django.db.models import Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api_errors import error_response
from core.permissions import IsAdminOrVendor
from core.serializers import LoginSerializer, UserMeSerializer
from expenses.models import Expense
from products.models import Product
from sales.models import Purchase, Sale
from sales.services import get_stock_lot_mismatch


def _sales_totals(sales_qs):
    sales = sales_qs.prefetch_related("cost_allocations")
    sales_count = sales.count()
    units_sold = 0
    gross_sales = Decimal("0.00")
    store_profit = Decimal("0.00")
    vendor_profit = Decimal("0.00")

    for sale in sales:
        units_sold += sale.quantity
        gross_sales += sale.unit_sale_price * sale.quantity
        store_profit += sale.store_profit
        vendor_profit += sale.vendor_profit

    return sales_count, units_sold, gross_sales, store_profit, vendor_profit


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user = authenticate(request, username=username, password=password)
        if user is None:
            return error_response(
                code="authentication_failed",
                detail="Credenciales invalidas.",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        login(request, user)
        return Response(UserMeSerializer(user).data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserMeSerializer(request.user).data, status=status.HTTP_200_OK)


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class VersionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            {
                "name": "iam-repuestos-api",
                "version": getattr(settings, "APP_VERSION", "0.1.0"),
            },
            status=status.HTTP_200_OK,
        )


class BootstrapView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            {
                "app": {
                    "name": "iam-repuestos-api",
                    "version": getattr(settings, "APP_VERSION", "0.1.0"),
                    "language": settings.LANGUAGE_CODE,
                    "timezone": settings.TIME_ZONE,
                },
                "auth": {
                    "roles": ["admin", "vendor"],
                    "login_path": "/api/auth/login/",
                    "me_path": "/api/auth/me/",
                    "logout_path": "/api/auth/logout/",
                },
                "pagination": {
                    "page_size": settings.REST_FRAMEWORK.get("PAGE_SIZE", 10),
                },
                "currency": {
                    "code": "BOB",
                    "symbol": "Bs.",
                },
                "routes": {
                    "products": "/api/products/",
                    "purchases": "/api/purchases/",
                    "sales": "/api/sales/",
                    "expenses": "/api/expenses/",
                    "cuts": "/api/cuts/",
                    "dashboard_report": "/api/reports/dashboard/",
                    "monthly_report": "/api/reports/monthly/",
                    "monthly_cut": "/api/cuts/",
                },
            },
            status=status.HTTP_200_OK,
        )


class DashboardSummaryView(APIView):
    permission_classes = [IsAdminOrVendor]

    @staticmethod
    def _safe_parse_date(value):
        try:
            return parse_date(value)
        except ValueError:
            return None

    def _parse_filters(self, request):
        from_date = request.query_params.get("from")
        to_date = request.query_params.get("to")
        month = request.query_params.get("month")

        if month:
            month_value = self._safe_parse_date(f"{month}-01")
            if month_value is None:
                return None, None, Response(
                    error_response(
                        code="invalid_query_params",
                        detail="El parametro month debe tener formato YYYY-MM.",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    ).data,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            start = month_value.replace(day=1)
            if start.month == 12:
                end = start.replace(year=start.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                end = start.replace(month=start.month + 1, day=1) - timedelta(days=1)
            return start, end, None

        start = self._safe_parse_date(from_date) if from_date else None
        end = self._safe_parse_date(to_date) if to_date else None

        if from_date and start is None:
            return None, None, Response(
                error_response(
                    code="invalid_query_params",
                    detail="El parametro from debe tener formato YYYY-MM-DD.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                ).data,
                status=status.HTTP_400_BAD_REQUEST,
            )
        if to_date and end is None:
            return None, None, Response(
                error_response(
                    code="invalid_query_params",
                    detail="El parametro to debe tener formato YYYY-MM-DD.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                ).data,
                status=status.HTTP_400_BAD_REQUEST,
            )
        if start and end and start > end:
            return None, None, Response(
                error_response(
                    code="invalid_query_params",
                    detail="El parametro from no puede ser mayor que to.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                ).data,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return start, end, None

    def get(self, request):
        user = request.user
        sales_qs = Sale.objects.select_related("product", "vendor").filter(is_closed_by_cut=False)
        expenses_qs = Expense.objects.select_related("vendor").filter(is_closed_by_cut=False)

        start_date, end_date, error_response = self._parse_filters(request)
        if error_response is not None:
            return error_response

        if start_date:
            sales_qs = sales_qs.filter(sold_at__date__gte=start_date)
            expenses_qs = expenses_qs.filter(spent_at__date__gte=start_date)
        if end_date:
            sales_qs = sales_qs.filter(sold_at__date__lte=end_date)
            expenses_qs = expenses_qs.filter(spent_at__date__lte=end_date)

        if user.role == "vendor":
            sales_qs = sales_qs.filter(vendor=user)
            expenses_qs = expenses_qs.filter(vendor=user)

        sales_count, units_sold, gross_sales, store_profit, vendor_profit = _sales_totals(sales_qs)
        total_expenses = expenses_qs.aggregate(total=Sum("amount"))["total"] or 0

        low_stock_products = Product.objects.filter(stock__lte=5, is_active=True).values("id", "sku", "name", "stock")[:10]

        return Response(
            {
                "role": user.role,
                "sales_count": sales_count,
                "units_sold": units_sold,
                "gross_sales": gross_sales,
                "store_profit": store_profit,
                "vendor_profit": vendor_profit,
                "total_expenses": total_expenses,
                "low_stock_products": list(low_stock_products),
                "filters": {
                    "from": start_date,
                    "to": end_date,
                },
            },
            status=status.HTTP_200_OK,
        )


class MonthlyReportView(APIView):
    permission_classes = [IsAdminOrVendor]

    @staticmethod
    def _safe_parse_date(value):
        try:
            return parse_date(value)
        except ValueError:
            return None

    def get(self, request):
        month = request.query_params.get("month")
        if not month:
            return error_response(
                code="invalid_query_params",
                detail="El parametro month es obligatorio (YYYY-MM).",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        start = self._safe_parse_date(f"{month}-01")
        if start is None:
            return error_response(
                code="invalid_query_params",
                detail="El parametro month debe tener formato YYYY-MM.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if start.month == 12:
            end = start.replace(year=start.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end = start.replace(month=start.month + 1, day=1) - timedelta(days=1)

        sales_qs = Sale.objects.select_related("product", "vendor").filter(
            sold_at__date__gte=start,
            sold_at__date__lte=end,
            is_closed_by_cut=False,
        )
        expenses_qs = Expense.objects.select_related("vendor").filter(
            spent_at__date__gte=start,
            spent_at__date__lte=end,
            is_closed_by_cut=False,
        )

        if request.user.role == "vendor":
            sales_qs = sales_qs.filter(vendor=request.user)
            expenses_qs = expenses_qs.filter(vendor=request.user)

        sales_count, units_sold, gross_sales, store_profit, vendor_profit = _sales_totals(sales_qs)
        total_expenses = expenses_qs.aggregate(total=Sum("amount"))["total"] or 0

        return Response(
            {
                "role": request.user.role,
                "month": month,
                "period": {"from": start, "to": end},
                "sales_count": sales_count,
                "units_sold": units_sold,
                "gross_sales": gross_sales,
                "store_profit": store_profit,
                "vendor_profit": vendor_profit,
                "total_expenses": total_expenses,
            },
            status=status.HTTP_200_OK,
        )


class InventoryCapitalView(APIView):
    permission_classes = [IsAdminOrVendor]

    def get(self, request):
        active_lots = Purchase.objects.filter(remaining__gt=0).select_related("product")

        by_product = {}
        for lot in active_lots:
            pid = lot.product_id
            if pid not in by_product:
                by_product[pid] = {
                    "product_id": pid,
                    "product_name": lot.product.name,
                    "product_sku": lot.product.sku,
                    "total_units": 0,
                    "capital": Decimal("0.00"),
                }
            by_product[pid]["total_units"] += lot.remaining
            by_product[pid]["capital"] += lot.remaining * lot.unit_cost

        total_capital = sum(p["capital"] for p in by_product.values())

        return Response(
            {
                "total_capital": str(Decimal(str(total_capital)).quantize(Decimal("0.01"))),
                "by_product": [
                    {
                        "product_id": v["product_id"],
                        "product_name": v["product_name"],
                        "product_sku": v["product_sku"],
                        "total_units": v["total_units"],
                        "capital": str(v["capital"].quantize(Decimal("0.01"))),
                    }
                    for v in sorted(by_product.values(), key=lambda x: x["product_name"])
                ],
            },
            status=status.HTTP_200_OK,
        )


class InventoryMismatchView(APIView):
    permission_classes = [IsAdminOrVendor]

    def get(self, request):
        mismatches = []
        for product in Product.objects.filter(is_active=True).order_by("name"):
            mismatch = get_stock_lot_mismatch(product=product)
            if mismatch is not None:
                mismatches.append(mismatch)
        return Response({"count": len(mismatches), "results": mismatches}, status=status.HTTP_200_OK)
