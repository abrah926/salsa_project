#!/usr/bin/env python3

import csv
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salsa.settings')
django.setup()

from events.models import Salsa

# File path for the CSV file
OUTPUT_FILE = "salsa_events.csv"

def generate_csv():
    """
    Generate a CSV file from the Salsa database table.
    """
    with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        # Write the header row
        writer.writerow(["Name", "Event Date", "Time", "Location", "Price", "Details", "Recurrence"])

        # Query the database for all events
        events = Salsa.objects.all()

        # Write event rows
        for event in events:
            writer.writerow([
                event.name,
                event.event_date,
                event.time,
                event.location,
                event.price,
                event.details,
                event.recurrence,
            ])

    print(f"CSV file '{OUTPUT_FILE}' generated successfully!")

if __name__ == "__main__":
    generate_csv()
