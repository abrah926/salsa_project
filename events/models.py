from django.db import models

class Salsa(models.Model):
    event_date = models.DateField(null=True, blank=True)  # Optional date
    day = models.CharField(max_length=50, null=True, blank=True)  # Optional day
    time = models.TimeField(null=True, blank=True)  # Optional time
    name = models.CharField(max_length=255, null=True, blank=True)  # Event name
    location = models.TextField(null=True, blank=True)  # Event location
    source = models.CharField(max_length=100, null=True, blank=True)  # Source
    price = models.CharField(max_length=50, null=True, blank=True)  # Price
    details = models.TextField(null=True, blank=True)  # Event details

    def __str__(self):
        return self.name or "Unnamed Event"
