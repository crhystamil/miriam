from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError

from cuts.models import MonthlyCut
from cuts.services import build_monthly_cut_report, execute_monthly_cut


class MonthlyCutSerializer(serializers.ModelSerializer):
    report = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MonthlyCut
        fields = [
            "id",
            "period",
            "cutoff_date",
            "closed_at",
            "closed_by",
            "notes",
            "status",
            "started_at",
            "finished_at",
            "report",
        ]
        read_only_fields = ["id", "period", "closed_at", "closed_by", "status", "started_at", "finished_at", "report"]

    def get_report(self, obj):
        return build_monthly_cut_report(cut=obj)

    def create(self, validated_data):
        request = self.context["request"]
        try:
            return execute_monthly_cut(
                cutoff_date=validated_data["cutoff_date"],
                actor=request.user,
                notes=validated_data.get("notes", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)
