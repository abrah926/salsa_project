import requests
from .models import Salsa, MapLocation

GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"

def populate_geolocation(event_id):
    """
    Fetch latitude and longitude for the event's location using Google Geocoding API
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
