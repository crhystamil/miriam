from django.contrib import admin

from .models import MonthlyCut


@admin.register(MonthlyCut)
class MonthlyCutAdmin(admin.ModelAdmin):
    list_display = ("period", "cutoff_date", "status", "closed_by", "closed_at")
    search_fields = ("period", "closed_by__username")
