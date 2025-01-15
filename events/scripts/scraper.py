import os
import requests
from datetime import datetime
import sys
import django
import logging
from typing import List, Dict, Any
from urllib.parse import urlparse, parse_qs

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the root directory of your project to sys.path
project_root = os.path.abspath(os.path.dirname(__file__) + "/../../")
sys.path.insert(0, project_root)

# Set up Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "salsa.settings")  # Directly reference `settings.py` in root
django.setup()

# Import your models
from events.models import Salsa

# Configuration
FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v15.0"
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")
SCRAPER_API_URL = "https://ed15-66-9-164-229.ngrok-free.app"
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
SEARCH_TERM = "salsa"

# Ensure required environment variables are set
if not FACEBOOK_ACCESS_TOKEN or not SCRAPER_API_KEY:
    raise EnvironmentError("Missing FACEBOOK_ACCESS_TOKEN or SCRAPER_API_KEY environment variable.")

def fetch_facebook_events(page_url):
    """
    Fetch events from a Facebook page using the Graph API, handling pagination.
    """
    parsed_url = urlparse(page_url)
    page_id = parsed_url.path.rstrip("/").split("/")[-1]  # Extracts 'SalsaConEstiloPR' from the path
    url = f"{FACEBOOK_GRAPH_API_URL}/{page_id}/events"
    params = {
        "access_token": FACEBOOK_ACCESS_TOKEN,
        "fields": "name,start_time,place,description,cover",
        "limit": 100,
    }
    events = []

    while url:
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            events.extend(data.get("data", []))
            url = data.get("paging", {}).get("next")
            params = None
        except requests.RequestException as e:
            logger.error(f"Error fetching events from Facebook page {page_id}: {e}")
            break

    return events

def parse_facebook_response(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Parse Facebook API response into a usable format.
    """
    parsed_events = []
    for event in events:
        description = event.get("description", "").lower()
        if SEARCH_TERM in description:
            parsed_events.append({
                "name": event["name"],
                "event_date": datetime.fromisoformat(event["start_time"]).date(),
                "time": datetime.fromisoformat(event["start_time"]).time(),
                "location": event.get("place", {}).get("name"),
                "details": description,
                "img_url": event.get("cover", {}).get("source"),
                "recurrence": None,
            })
    return parsed_events

def fetch_danceus_events(url: str) -> Dict[str, Any]:
    """
    Fetch events from DanceUS.org using the Scraper API.
    """
    headers = {
        "Authorization": f"Bearer {SCRAPER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"url": url}

    try:
        response = requests.post(SCRAPER_API_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()  # Assuming the response is in JSON format
    except requests.RequestException as e:
        logger.error(f"Error fetching events from DanceUS.org: {e}")
        return {}

def parse_danceus_response(scraper_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Parse the DanceUS.org Scraper API response into a usable format.
    """
    parsed_events = []
    for event in scraper_response.get("events", []):  # Adjust based on the actual API response structure
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

def save_events_to_db(events: List[Dict[str, Any]], source: str) -> None:
    """
    Save scraped events into the database.
    """
    for event in events:
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
            logger.info(f"Added event: {event['name']} on {event['event_date']}")
        else:
            logger.info(f"Skipped duplicate event: {event['name']} on {event['event_date']}")

def run_scraper() -> None:
    """
    Main script to scrape events from Facebook and DanceUS.org and save them into the database.
    """
    # Facebook URL
    facebook_url = "https://www.facebook.com/groups/SalsaConEstiloPR/?ref=share&mibextid=NSMWBT"
    logger.info(f"Fetching Facebook events from: {facebook_url}")
    fb_events = fetch_facebook_events(facebook_url)
    if fb_events:
        parsed_fb_events = parse_facebook_response(fb_events)
        save_events_to_db(parsed_fb_events, source="facebook")

    # DanceUS.org URL
    danceus_url = "https://www.danceus.org/events/salsa/puerto-rico-salsa-calendar/"
    logger.info(f"Fetching DanceUS.org events from: {danceus_url}")
    scraper_response = fetch_danceus_events(danceus_url)
    if scraper_response:
        parsed_danceus_events = parse_danceus_response(scraper_response)
        save_events_to_db(parsed_danceus_events, source="danceus")

if __name__ == "__main__":
    run_scraper()
