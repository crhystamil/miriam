from django.contrib import admin

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    max_num = 5


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("sku", "name", "stock", "cost_price", "wholesale_reference_price", "public_price", "is_active")
    list_filter = ("is_active",)
    search_fields = ("sku", "name")
    inlines = (ProductImageInline,)
