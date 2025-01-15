import os
import asyncio
import subprocess
import logging
from typing import List, Dict, Any
from pyppeteer import launch

from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration for scraping
SEARCH_TERM = "salsa"

def save_events_to_db(events: List[Dict[str, Any]], source: str) -> None:
    """
    Save scraped events into the database.
    """
    for event in events:
        # Example: Adjust this logic to save to your database
        logger.info(f"Saving event from {source}: {event}")
    logger.info(f"Saved {len(events)} events from {source} to the database.")

# Puppeteer scraping logic
async def scrape_danceus_with_puppeteer(url: str) -> List[Dict[str, Any]]:
    """
    Scrape DanceUS.org using Puppeteer (pyppeteer) for JavaScript-rendered content.
    """
    logger.info("Launching Puppeteer to scrape DanceUS.org...")
    browser = await launch(headless=True)
    page = await browser.newPage()
    await page.goto(url, {"waitUntil": "domcontentloaded"})

    # Extract events
    events = await page.evaluate('''() => {
        const eventElements = document.querySelectorAll('.event-container');  // Adjust this selector based on the website
        return Array.from(eventElements).map(event => ({
            name: event.querySelector('.event-title')?.innerText || null,
            date: event.querySelector('.event-date')?.innerText || null,
            location: event.querySelector('.event-location')?.innerText || null,
            details: event.querySelector('.event-details')?.innerText || null,
            img_url: event.querySelector('img')?.src || null,
        }));
    }''')

    await browser.close()
    logger.info(f"Scraped {len(events)} events using Puppeteer.")
    return events

def fetch_danceus_events_with_puppeteer(url: str) -> List[Dict[str, Any]]:
    """
    Wrapper to fetch DanceUS.org events via Puppeteer.
    """
    try:
        return asyncio.run(scrape_danceus_with_puppeteer(url))
    except Exception as e:
        logger.error(f"Error scraping DanceUS.org with Puppeteer: {e}")
        return []

# Bochilteam scraper logic
def fetch_danceus_events_with_bochil(url: str) -> List[Dict[str, Any]]:
    """
    Scrape DanceUS.org using @bochilteam/scraper via Node.js.
    """
    try:
        result = subprocess.run(
            ['node', 'bochil_scraper.js', url],
            capture_output=True,
            text=True,
            check=True
        )
        scraped_data = json.loads(result.stdout)
        logger.info(f"Scraped {len(scraped_data)} events using Bochilteam scraper.")
        return scraped_data
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running Bochilteam scraper: {e.stderr}")
        return []

# Main scraping function
def run_scraper2() -> None:
    """
    Scrape events from DanceUS.org using Puppeteer and Bochilteam scraper.
    """
    danceus_url = "https://www.danceus.org/events/salsa/puerto-rico-salsa-calendar/"

    # Puppeteer scraping
    logger.info(f"Fetching DanceUS.org events with Puppeteer from: {danceus_url}")
    puppeteer_events = fetch_danceus_events_with_puppeteer(danceus_url)
    if puppeteer_events:
        save_events_to_db(puppeteer_events, source="danceus_puppeteer")

    # Bochilteam scraper
    logger.info(f"Fetching DanceUS.org events with Bochilteam scraper from: {danceus_url}")
    bochil_events = fetch_danceus_events_with_bochil(danceus_url)
    if bochil_events:
        save_events_to_db(bochil_events, source="danceus_bochil")

if __name__ == "__main__":
    run_scraper2()
