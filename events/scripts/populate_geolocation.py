import requests
from events.models import Salsa, MapLocation

GOOGLE_API_KEY = "AIzaSyATKyyw6SlyD0Za-RjAJRvGPHDZKxF31-E"

DEFAULT_LOCATION_SUFFIX = ", San Juan, Puerto Rico"

def populate_geolocation(event_id):
    """
    Fetch latitude and longitude for the event's location using the Geocoding API
    and save it to the MapLocation model.
    """
    event = Salsa.objects.get(id=event_id)
    if not event.location:
        raise ValueError("Event location is required to fetch geolocation data.")
    
    # Append default city/region to the address
    address = event.location
    if not "," in address:  # If the address lacks details, append the default
        address += DEFAULT_LOCATION_SUFFIX
    
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": GOOGLE_API_KEY}
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            location = data['results'][0]['geometry']['location']
            print(f"Fetched coordinates for {event.name}: {location['lat']}, {location['lng']}")
            MapLocation.objects.update_or_create(
                event=event,
                defaults={
                    "latitude": location['lat'],
                    "longitude": location['lng']
                }
            )
            print(f"Saved geolocation for {event.name}")
        else:
            print(f"Error for {event.name}: {data['status']} - {data.get('error_message', 'No error message')}")
    else:
        print(f"HTTP Error for {event.name}: {response.status_code}")


def batch_populate_geolocation():
    """
    Populate geolocation for all events with a valid location.
    """
    events = Salsa.objects.all()
    for event in events:
        try:
            if event.location:
                populate_geolocation(event.id)
                print(f"Geolocation populated for: {event.name}")
            else:
                print(f"Skipped event: {event.name} (No location provided)")
        except Exception as e:
            print(f"Failed for {event.name}: {e}")
