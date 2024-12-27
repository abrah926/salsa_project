from django.db import models
import requests

GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'

class Salsa(models.Model):
    event_date = models.DateField(null=True, blank=True)  # Optional date
    day = models.CharField(max_length=50, null=True, blank=True)  # Optional day
    time = models.TimeField(null=True, blank=True)  # Optional time
    name = models.CharField(max_length=255, null=True, blank=True)  # Event name
    location = models.TextField(null=True, blank=True)  # Event location
    source = models.CharField(max_length=100, null=True, blank=True)  # Source
    price = models.CharField(max_length=50, null=True, blank=True)  # Price
    details = models.TextField(null=True, blank=True)  # Event details
    recurrence = models.CharField(
        max_length=50, null=True, blank=True, 
        choices=[("DAILY", "Daily"), ("WEEKLY", "Weekly"), ("MONTHLY", "Monthly")],
    )  # For recurring events

    def __str__(self):
        return self.name or "Unnamed Event"

    class Meta:
        db_table = "salsas"  # Custom table name in the database

class MapLocation(models.Model):
    event = models.OneToOneField(
        'events.Salsa',
        on_delete=models.CASCADE,
        related_name='map_location'
    )
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.event.name} Location"

