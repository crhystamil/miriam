"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from cuts.views import MonthlyCutViewSet
from core.views import (
    BootstrapView,
    DashboardSummaryView,
    HealthView,
    InventoryCapitalView,
    LoginView,
    LogoutView,
    MeView,
    MonthlyReportView,
    VersionView,
)
from expenses.views import ExpenseViewSet
from products.views import ProductViewSet
from sales.views import PurchaseViewSet, SaleViewSet, WholesalerViewSet

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("purchases", PurchaseViewSet, basename="purchase")
router.register("sales", SaleViewSet, basename="sale")
router.register("wholesalers", WholesalerViewSet, basename="wholesaler")
router.register("expenses", ExpenseViewSet, basename="expense")
router.register("cuts", MonthlyCutViewSet, basename="monthly-cut")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/system/health/", HealthView.as_view(), name="api-system-health"),
    path("api/system/version/", VersionView.as_view(), name="api-system-version"),
    path("api/system/bootstrap/", BootstrapView.as_view(), name="api-system-bootstrap"),
    path("api/auth/login/", LoginView.as_view(), name="api-login"),
    path("api/auth/logout/", LogoutView.as_view(), name="api-logout"),
    path("api/auth/me/", MeView.as_view(), name="api-me"),
    path("api/reports/dashboard/", DashboardSummaryView.as_view(), name="api-dashboard-summary"),
    path("api/reports/monthly/", MonthlyReportView.as_view(), name="api-monthly-report"),
    path("api/reports/inventory-capital/", InventoryCapitalView.as_view(), name="api-inventory-capital"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
