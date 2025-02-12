from django.db import models
import requests
from django.utils import timezone

GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'

class Salsa(models.Model):
    event_date = models.DateTimeField(default=timezone.now)
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
    recurrence_interval = models.IntegerField(
        null=True, blank=True, default=1, 
        help_text="Interval for recurrence (e.g., every 2 weeks)"
    )  # Interval for recurring events
    end_recurring_date = models.DateField(
        null=True, blank=True, 
        help_text="Last date of recurrence"
    )  # End date for recurring events
    image_url = models.URLField(max_length=500, null=True, blank=True)  # Image field
    phone_number = models.CharField(max_length=20, null=True, blank=True)  # New field
    created_at = models.DateTimeField(auto_now_add=True)    # Keep these
    updated_at = models.DateTimeField(auto_now=True)        # Keep these

    def __str__(self):
        return self.name or "Unnamed Event"

    class Meta:
        db_table = "salsas"  # Custom table name in the database
