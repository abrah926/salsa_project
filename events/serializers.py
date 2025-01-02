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
    recurrence = serializers.ChoiceField(
        required=False,
        allow_null=True,
        choices=[("DAILY", "Daily"), ("WEEKLY", "Weekly"), ("MONTHLY", "Monthly")]
    )
    recurrence_interval = serializers.IntegerField(
        required=False, allow_null=True, min_value=1
    )
    end_date = serializers.DateField(required=False, allow_null=True)
    end_recurring_date = serializers.DateField(required=False, allow_null=True)

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

    def validate_recurrence_interval(self, value):
        # Ensure the interval is a positive integer
        if value < 1:
            raise serializers.ValidationError("Recurrence interval must be at least 1.")
        return value

    def validate_end_recurring_date(self, value):
        # Ensure the end_recurring_date is not before the event_date
        if value and self.initial_data.get('event_date') and value < self.initial_data.get('event_date'):
            raise serializers.ValidationError(
                "End recurring date cannot be before the event date."
            )
        return value
class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salsa
        fields = [
            'name', 
            'event_date', 
            'location', 
            'details', 
            'price',
            'recurrence',
            'recurrence_interval',
            'end_recurring_date'
        ]

    def to_representation(self, instance):
        """Customizes the serialized output."""
        data = super().to_representation(instance)
        # FullCalendar expects these field names
        data['title'] = data.pop('name')
        data['start'] = data.pop('event_date')
        return data
