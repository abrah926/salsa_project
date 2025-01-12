import os
import requests
from datetime import datetime
from events.models import Salsa 

# Replace with your actual Scraper API endpoint and key
SCRAPER_API_URL = "https://api.superlocal.dev/scraper"
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

def fetch_events_from_url(url):
    """
    Fetch events from a given URL using the Scraper agent.
    """
    headers = {
        "Authorization": f"Bearer {SCRAPER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"url": url}

    try:
        response = requests.post(SCRAPER_API_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()  # Assuming the response is in JSON format
    except requests.RequestException as e:
        print(f"Error fetching events from {url}: {e}")
        return None

def parse_scraper_response(scraper_response):
    """
    Parse the response from the Scraper API into a usable format.
    """
    events = []
    for event in scraper_response.get("events", []):  # Adjust based on actual response structure
        events.append({
            "name": event.get("name"),
            "event_date": event.get("date"),
            "time": event.get("time"),
            "location": event.get("location"),
            "details": event.get("details"),
            "recurrence": "WEEKLY" if "weekly" in event.get("details", "").lower() else None,
        })
    return events

def save_events_to_db(events):
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
                source="scraped",
                details=event.get("details"),
                recurrence=event.get("recurrence"),
                recurrence_interval=1 if event.get("recurrence") == "WEEKLY" else None
            )
            print(f"Added event: {event['name']} on {event['event_date']}")
        else:
            print(f"Skipped duplicate event: {event['name']} on {event['event_date']}")

def run_scraper():
    """
    Main script to scrape events from multiple URLs and save them into the database.
    """
    # List of URLs to scrape
    urls = [
        "https://example.com/events-page-1",
        "https://example.com/events-page-2",
    ]

    for url in urls:
        print(f"Fetching events from: {url}")
        scraper_response = fetch_events_from_url(url)
        if scraper_response:
            events = parse_scraper_response(scraper_response)
            save_events_to_db(events)

if __name__ == "__main__":
    run_scraper()
