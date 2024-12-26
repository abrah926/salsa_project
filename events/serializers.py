from rest_framework import serializers
from .models import Salsa
import datetime

class SalsaSerializer(serializers.ModelSerializer):
    event_date = serializers.DateField(required=False, allow_null=True)
    time = serializers.TimeField(required=False, allow_null=True)
    day = serializers.CharField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True)
    location = serializers.CharField(required=False, allow_null=True)
    source = serializers.CharField(required=False, allow_null=True)
    price = serializers.CharField(required=False, allow_null=True)
    details = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Salsa
        fields = '__all__'

def validate_time(self, value):
    # Ensure the time is in hh:mm format
    try:
        datetime.datetime.strptime(value, '%H:%M')  # Try to parse as hh:mm
    except ValueError:
        raise serializers.ValidationError(
            "Time format is invalid. Please use 'hh:mm'."
        )
    return value


def validate_event_date(self, value):
        # Ensure the date is in yyyy-mm-dd format
        try:
            datetime.datetime.strptime(str(value), '%Y-%m-%d')
        except ValueError:
            raise serializers.ValidationError(
                "Date format is invalid. Please use 'YYYY-MM-DD'."
            )
        return value