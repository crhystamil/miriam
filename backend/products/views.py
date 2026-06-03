from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

from core.permissions import IsAdminOrReadOnly
from products.models import Product
from products.serializers import ProductSerializer
from products.services import deactivate_product


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.prefetch_related("images").all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get("search")
        is_active = self.request.query_params.get("is_active")
        low_stock = self.request.query_params.get("low_stock")

        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(sku__icontains=search))
        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=(is_active == "true"))
        elif self.action == "list":
            queryset = queryset.filter(is_active=True)
        if low_stock == "true":
            queryset = queryset.filter(stock__lte=5)
        return queryset.order_by("name")

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        deactivate_product(product=product)
        return Response(status=status.HTTP_204_NO_CONTENT)
