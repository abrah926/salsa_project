import requests
from bs4 import BeautifulSoup
from events.models import Salsa
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import re
import logging
from dateutil import parser

logging.basicConfig(level=logging.INFO)

recurrence_keywords = {
    "weekly": [
        "every week", "every monday", "every tuesday", "every wednesday", "every thursday", "every friday", "every saturday", "every sunday",
        "todos los lunes", "todos los martes", "todos los miercoles", "todos los jueves", "todos los viernes", "todos los sabados", "todos los domingos"
    ],
    "monthly": ["every last sunday", "every first monday"],
    "daily": ["every day"]
}

def detect_recurrence(text):
    for recurrence_type, keywords in recurrence_keywords.items():
        for keyword in keywords:
            if keyword in text.lower():
                return recurrence_type
    return None

def extract_recurrence_details(text):
    weekly_pattern = r"every\s+(\w+)"  # Matches "every Friday"
    monthly_pattern = r"every\s+(last|first|second|third|fourth)\s+(\w+)"  # Matches "every last Sunday"

    if "week" in text.lower():
        match = re.search(weekly_pattern, text.lower())
        if match:
            return "WEEKLY", match.group(1)  # Return recurrence type and day
    elif "month" in text.lower():
        match = re.search(monthly_pattern, text.lower())
        if match:
            return "MONTHLY", match.group(1) + " " + match.group(2)  # Return recurrence type and frequency
    return None, None

from dateutil import parser
from datetime import datetime

def scrape_static_events():
    urls = [
        "https://www.danceus.org/events/salsa/puerto-rico-salsa-calendar/",
        "https://www.puertorico.com/nightlife"
    ]
    gathered_events = []
    for url in urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            if "danceus" in url:
                events = soup.find_all('div', class_='item-info-container')
            elif "puertorico.com" in url:
                events = soup.find_all('div', class_='event-block')

            for event in events:
                name = event.find('a', class_='item-title').get_text(strip=True)
                description = event.find('p', class_='description').get_text(strip=True) if event.find('p', class_='description') else ""

                if "salsa" not in name.lower() and "salsa" not in description.lower():
                    logging.info(f"Skipped non-salsa event: {name}")
                    continue

                date_text = event.find('div', class_='event-period').get_text(strip=True)
                location = event.find('div', class_='location').get_text(strip=True) if event.find('div', 'location') else "Location not specified"

                # Parse the date using dateutil
                try:
                    parsed_date = parser.parse(date_text.split("@")[0])  # Extract the first part before '@'
                    event_date = parsed_date.strftime('%Y-%m-%d')  # Convert to YYYY-MM-DD format
                except (ValueError, parser.ParserError) as e:
                    logging.error(f"Invalid date format for event: {name}, Date: {date_text}, Error: {e}")
                    continue

                recurrence_type = detect_recurrence(description)

                if not Salsa.objects.filter(name=name, event_date=event_date).exists():
                    Salsa.objects.create(
                        name=name,
                        event_date=event_date,
                        location=location,
                        details=description,
                        source=url,
                        recurrence=recurrence_type.upper() if recurrence_type else None,
                        recurrence_interval=1 if recurrence_type else None
                    )
                    logging.info(f"Added static event: {name}, Recurrence: {recurrence_type}")
                gathered_events.append((name, event_date, location, description, recurrence_type))
        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")
    return gathered_events



def scrape_dynamic_events():
    urls = [
        "https://allevents.in/san%20juan/music?ref=cityhome-category-section#search",
        "https://www.discoverpuertorico.com/es/que-hacer/eventos#!grid~~~date~1~~"
    ]

    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service('/usr/local/bin/chromedriver'), options=options)

    gathered_events = []
    for url in urls:
        try:
            driver.get(url)

            if "allevents" in url:
                events = driver.find_elements(By.CLASS_NAME, 'card')  # Adjust based on actual HTML
            elif "discoverpuertorico" in url:
                events = driver.find_elements(By.CLASS_NAME, 'event-item')  # Adjust based on actual HTML

            for event in events:
                name = event.find_element(By.TAG_NAME, 'h2').text.strip()
                date_text = event.find_element(By.CLASS_NAME, 'date').text.strip()
                location = event.find_element(By.CLASS_NAME, 'location').text.strip()
                details = event.find_element(By.CLASS_NAME, 'description').text.strip()

                # Check if "salsa" is in the name or details
                if "salsa" not in name.lower() and "salsa" not in details.lower():
                    continue  # Skip if the event is not salsa-related

                # Convert the date
                try:
                    event_date = datetime.strptime(date_text, '%Y-%m-%d')
                except ValueError:
                    logging.error(f"Invalid date format for event: {name}, Date: {date_text}")
                    continue

                # Detect recurrence
                recurrence_type = detect_recurrence(details)

                # Save to the database if not already existing
                if not Salsa.objects.filter(name=name, event_date=event_date).exists():
                    Salsa.objects.create(
                        name=name,
                        event_date=event_date,
                        location=location,
                        details=details,
                        source=url,
                        recurrence=recurrence_type.upper() if recurrence_type else None,
                        recurrence_interval=1 if recurrence_type else None
                    )
                    logging.info(f"Added dynamic event: {name}, Recurrence: {recurrence_type}")
                gathered_events.append((name, event_date, location, details, recurrence_type))
        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")
    driver.quit()
    return gathered_events

def run():
    logging.info("Starting scraper...")
    static_events = scrape_static_events()
    dynamic_events = scrape_dynamic_events()

    if static_events or dynamic_events:
        print("\nGathered Events:")
        for event in static_events + dynamic_events:
            print(f"Name: {event[0]}, Date: {event[1]}, Location: {event[2]}, Details: {event[3]}, Recurrence: {event[4]}")
    else:
        print("No events were gathered.")

    logging.info("Scraper completed.")


def run():
    logging.info("Starting scraper...")
    static_events = scrape_static_events()
    dynamic_events = scrape_dynamic_events()

    if static_events or dynamic_events:
        print("\nGathered Events:")
        for event in static_events + dynamic_events:
            print(f"Name: {event[0]}, Date: {event[1]}, Location: {event[2]}, Details: {event[3]}, Recurrence: {event[4]}")
    else:
        print("No events were gathered.")

    logging.info("Scraper completed.")
