from django.utils.dateparse import parse_date
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from core.permissions import IsAdmin, IsAdminOrVendor
from sales.models import Purchase, Sale, Wholesaler
from sales.serializers import PurchaseSerializer, SaleSerializer, WholesalerSerializer
from sales.services import deactivate_sale


class PurchaseViewSet(ModelViewSet):
    queryset = Purchase.objects.select_related("product").order_by("-purchased_at", "-id")
    serializer_class = PurchaseSerializer
    permission_classes = [IsAdmin]


class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.select_related("product", "vendor", "wholesaler").all()
    serializer_class = SaleSerializer
    permission_classes = [IsAdminOrVendor]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.filter(is_closed_by_cut=False)
        sold_from = self.request.query_params.get("from")
        sold_to = self.request.query_params.get("to")
        product_id = self.request.query_params.get("product")
        wholesaler_id = self.request.query_params.get("wholesaler")
        is_active = self.request.query_params.get("is_active")

        if user.role == "admin":
            pass
        else:
            queryset = queryset.filter(vendor=user)

        if sold_from:
            parsed_from = parse_date(sold_from)
            if parsed_from:
                queryset = queryset.filter(sold_at__date__gte=parsed_from)
        if sold_to:
            parsed_to = parse_date(sold_to)
            if parsed_to:
                queryset = queryset.filter(sold_at__date__lte=parsed_to)
        if product_id and product_id.isdigit():
            queryset = queryset.filter(product_id=int(product_id))
        if wholesaler_id and wholesaler_id.isdigit():
            queryset = queryset.filter(wholesaler_id=int(wholesaler_id))
        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=(is_active == "true"))
        return queryset

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        sale = self.get_object()
        try:
            deactivate_sale(sale=sale, actor=request.user)
        except DjangoValidationError as exc:
            return Response({"code": "validation_error", "detail": "Error de validacion.", "field_errors": {"sale": exc.messages}}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(sale)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response({"code": "permission_denied", "detail": "No tiene permisos para eliminar ventas."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class WholesalerViewSet(ReadOnlyModelViewSet):
    queryset = Wholesaler.objects.filter(is_active=True).all()
    serializer_class = WholesalerSerializer
    permission_classes = [IsAdminOrVendor]
