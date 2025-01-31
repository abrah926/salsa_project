from rest_framework import serializers
from .models import Salsa
import datetime
import re


class SalsaSerializer(serializers.ModelSerializer):
    event_date = serializers.DateField(required=False, allow_null=True)
    time = serializers.TimeField(required=False, allow_null=True)  # Start time
    end_time = serializers.TimeField(required=False, allow_null=True)  # End time
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
    image_url = serializers.URLField(required=False, allow_null=True)

    class Meta:
        model = Salsa
        fields = [
            'id',
            'event_date',
            'name',
            'day',
            'time',
            'location',
            'source',
            'price',
            'details',
            'recurrence',
            'recurrence_interval',
            'end_recurring_date',
            'image_url',
            'created_at',
            'updated_at',
            'end_date',
            'description',
            'map_location',
        ]

    def validate_time(self, value):
        """
        Extracts and validates the first 5 characters of the time input (e.g., '17:00').
        Handles formats like '17:00 - 23:00', '17:00/23:00', '17:00 23:00', or similar.
        """
        if isinstance(value, str):
            # Extract the first 5 characters to get the starting time
            value = value[:5]

            # Validate the extracted time format
            try:
                datetime.datetime.strptime(value, '%H:%M')  # Validate as 'hh:mm'
            except ValueError:
                raise serializers.ValidationError(
                    "Invalid time format. Ensure the time is in 'hh:mm' format."
                )
        return value

    def validate_event_date(self, value):
        # Keep as is
        try:
            datetime.datetime.strptime(str(value), '%Y-%m-%d')  # Validate date format
        except ValueError:
            raise serializers.ValidationError(
                "Date format is invalid. Please use 'YYYY-MM-DD'."
            )
        return value

    def validate_recurrence_interval(self, value):
        """
        Validate recurrence interval for recurrence types.
        """
        recurrence = self.initial_data.get('recurrence')
        if recurrence in ["WEEKLY", "MONTHLY"]:
            if value is None or value < 1:
                raise serializers.ValidationError(
                    "Recurrence interval must be a positive integer for weekly or monthly events."
                )
        elif recurrence is None or recurrence == "DAILY":
            if value is not None:
                raise serializers.ValidationError(
                    "Recurrence interval must be null for non-weekly or non-monthly events."
                )
        return value

    def validate_end_recurring_date(self, value):
        """
        Ensure end_recurring_date is not earlier than event_date.
        """
        event_date = self.initial_data.get('event_date')
        if value and event_date and value < event_date:
            raise serializers.ValidationError(
                "End recurring date cannot be before the event date."
            )
        return value

    def validate(self, data):
        """
        Ensure end_time is later than time if both are provided.
        """
        time = data.get('time')
        end_time = data.get('end_time')

        if time and end_time and time >= end_time:
            raise serializers.ValidationError("End time must be after the start time.")
        return data

    @staticmethod
    def _convert_time_format(time_str):
        """
        Converts times like '8pm' to '20:00' or '1am' to '01:00'.
        """
        try:
            match = re.match(r"(\d+)(am|pm)", time_str.strip().lower())
            if not match:
                raise ValueError

            hour = int(match.group(1))
            meridiem = match.group(2)

            if meridiem == 'pm' and hour != 12:
                hour += 12
            if meridiem == 'am' and hour == 12:
                hour = 0

            return datetime.time(hour, 0)  # Return a Python `time` object
        except Exception:
            raise serializers.ValidationError(
                "Invalid time format. Use '8pm' or '20:00'."
            )


class CalendarEventSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying events in a calendar-friendly format.
    """

    class Meta:
        model = Salsa
        fields = [
            'name',
            'event_date',
            'time',
            'end_time',
            'location',
            'details',
            'price',
            'recurrence',
            'recurrence_interval',
            'end_recurring_date',
            'image_url'
        ]

    def to_representation(self, instance):
        """
        Customizes the serialized output for calendar use.
        """
        data = super().to_representation(instance)
        # FullCalendar expects these field names
        data['title'] = data.pop('name', None)
        data['start'] = data.pop('event_date', None)
        data['end'] = instance.end_time if instance.end_time else None
        return data


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salsa
        fields = [
            'id',
            'event_date',
            'name',  # We have name here
            'title',  # And title - one of these is redundant
            # ... other fields
        ]
