from django.contrib import admin

from .models import Purchase, Sale, Wholesaler


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "quantity", "unit_cost", "purchased_at")
    search_fields = ("product__name", "product__sku")


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product",
        "vendor",
        "quantity",
        "unit_sale_price",
        "store_profit",
        "vendor_profit",
        "sold_at",
    )
    search_fields = ("product__name", "product__sku", "vendor__username")


@admin.register(Wholesaler)
class WholesalerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "phone_normalized", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "phone", "phone_normalized")
