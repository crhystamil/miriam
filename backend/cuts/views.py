from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from core.permissions import IsAdmin
from cuts.models import MonthlyCut
from cuts.serializers import MonthlyCutSerializer


class MonthlyCutViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = MonthlyCut.objects.select_related("closed_by").all()
    serializer_class = MonthlyCutSerializer
    permission_classes = [IsAdmin]
