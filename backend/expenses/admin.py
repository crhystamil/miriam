from django.contrib import admin

from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("id", "scope", "vendor", "concept", "amount", "spent_at")
    list_filter = ("scope",)
    search_fields = ("concept", "vendor__username")
