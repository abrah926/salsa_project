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
    
def populate_geolocation(event_id):
    """
    Fetch latitude and longitude for the event's location using the Geocoding API
    and save it to the MapLocation model.
    """
    event = Salsa.objects.get(id=event_id)
    if not event.location:
        raise ValueError("Event location is required to fetch geolocation data.")
    
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": event.location, "key": GOOGLE_API_KEY}
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            location = data['results'][0]['geometry']['location']
            MapLocation.objects.update_or_create(
                event=event,
                defaults={
                    "latitude": location['lat'],
                    "longitude": location['lng']
                }
            )
            print(f"Geolocation saved for event: {event.name}")
        else:
            print(f"Error from Geocoding API: {data['status']}")
    else:
        print(f"Failed to fetch geolocation data. Status code: {response.status_code}")

