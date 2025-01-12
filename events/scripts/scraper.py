import os
import requests
from datetime import datetime
from events.models import Salsa

# Configuration
FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v15.0"
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")
SCRAPER_API_URL = "https://ed15-66-9-164-229.ngrok-free.app"  # Replace with your actual Scraper API endpoint
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
SEARCH_TERM = "salsa"

def fetch_facebook_events(page_url):
    """
    Fetch events from a Facebook page using the Graph API, handling pagination.
    """
    page_id = page_url.split("/")[-1]
    url = f"{FACEBOOK_GRAPH_API_URL}/{page_id}/events"
    params = {
        "access_token": FACEBOOK_ACCESS_TOKEN,
        "fields": "name,start_time,place,description,cover",
        "limit": 100,
    }
    events = []

    while url:
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            # Add events to the list
            events.extend(data.get("data", []))

            # Check for the next page
            url = data.get("paging", {}).get("next")
            params = None  # After the first request, 'params' is not needed
        except requests.RequestException as e:
            print(f"Error fetching events from Facebook page {page_id}: {e}")
            break

    return events

def parse_facebook_response(events):
    """
    Parse Facebook API response into a usable format.
    """
    parsed_events = []
    for event in events:
        description = event.get("description", "").lower()
        if SEARCH_TERM in description:  # Check if it's a salsa event
            parsed_events.append({
                "name": event["name"],
                "event_date": datetime.fromisoformat(event["start_time"]).date(),
                "time": datetime.fromisoformat(event["start_time"]).time(),
                "location": event.get("place", {}).get("name"),
                "details": description,
                "img_url": event.get("cover", {}).get("source"),  # Facebook's cover image URL
                "recurrence": None,  # Facebook API doesn't provide recurrence info
            })
    return parsed_events

def fetch_danceus_events(url):
    """
    Fetch events from DanceUS.org using the Scraper API.
    """
    headers = {
        "Authorization": f"Bearer {SCRAPER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"url": url}

    try:
        response = requests.post(SCRAPER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()  # Assuming the response is in JSON format
    except requests.RequestException as e:
        print(f"Error fetching events from DanceUS.org: {e}")
        return None

def parse_danceus_response(scraper_response):
    """
    Parse the DanceUS.org Scraper API response into a usable format.
    """
    parsed_events = []
    for event in scraper_response.get("events", []):  # Adjust based on the actual API response
        parsed_events.append({
            "name": event.get("name"),
            "event_date": event.get("date"),
            "time": event.get("time"),
            "location": event.get("location"),
            "details": event.get("details"),
            "img_url": event.get("img_url"),  # Assuming the scraper extracts an image URL
            "recurrence": "WEEKLY" if "weekly" in event.get("details", "").lower() else None,
        })
    return parsed_events

def save_events_to_db(events, source):
    """
    Save scraped events into the database.
    """
    for event in events:
        # Check for duplicates
        if not Salsa.objects.filter(name=event["name"], event_date=event["event_date"]).exists():
            Salsa.objects.create(
                name=event["name"],
                event_date=event["event_date"],
                time=event.get("time"),
                location=event.get("location"),
                source=source,
                details=event.get("details"),
                img_url=event.get("img_url"),
                recurrence=event.get("recurrence"),
                recurrence_interval=1 if event.get("recurrence") == "WEEKLY" else None
            )
            print(f"Added event: {event['name']} on {event['event_date']}")
        else:
            print(f"Skipped duplicate event: {event['name']} on {event['event_date']}")

def run_scraper():
    """
    Main script to scrape events from Facebook and DanceUS.org and save them into the database.
    """
    # Facebook URL
    facebook_url = "https://www.facebook.com/groups/SalsaConEstiloPR/?ref=share&mibextid=NSMWBT"  # Facebook page URL
    print(f"Fetching Facebook events from: {facebook_url}")
    fb_events = fetch_facebook_events(facebook_url)
    if fb_events:
        parsed_fb_events = parse_facebook_response(fb_events)
        save_events_to_db(parsed_fb_events, source="facebook")

    # DanceUS.org URL
    danceus_url = "https://www.danceus.org/events/salsa/puerto-rico-salsa-calendar/"
    print(f"Fetching DanceUS.org events from: {danceus_url}")
    scraper_response = fetch_danceus_events(danceus_url)
    if scraper_response:
        parsed_danceus_events = parse_danceus_response(scraper_response)
        save_events_to_db(parsed_danceus_events, source="danceus")

if __name__ == "__main__":
    run_scraper()
