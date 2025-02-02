from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from events.models import Salsa

# Define limits for future dates
MAX_FUTURE_LIMIT = date.today() + timedelta(days=365)  # 1 year
MIN_FUTURE_LIMIT = date.today() + timedelta(days=6 * 30)  # 6 months

def fetch_recurring_events():
    """Fetch recurring events from the database."""
    today = date.today()
    return Salsa.objects.filter(
        recurrence__in=["WEEKLY", "MONTHLY"],
        recurrence_interval=1,
        event_date__lte=today
    )

def generate_future_dates(event, end_date):
    """Generate future dates based on the event's recurrence rules."""
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "WEEKLY":
            current_date += timedelta(weeks=interval)
        elif recurrence == "MONTHLY":
            current_date += relativedelta(months=interval)
        else:
            break  # Skip unsupported recurrence types

        if current_date <= end_date:
            future_dates.append(current_date)

    return future_dates

def populate_future_events():
    """Generate future events without duplication."""
    print("Starting to populate future events...")
    recurring_events = fetch_recurring_events()

    for event in recurring_events:
        event_end_date = event.end_recurring_date or MAX_FUTURE_LIMIT
        end_date = min(event_end_date, MAX_FUTURE_LIMIT)

        future_dates = generate_future_dates(event, end_date)

        for future_date in future_dates:
            if future_date < MIN_FUTURE_LIMIT:
                continue

            if not Salsa.objects.filter(name=event.name, event_date=future_date).exists():
                Salsa.objects.create(
                    name=event.name,
                    event_date=future_date,
                    time=event.time,
                    location=event.location,
                    source=event.source,
                    price=event.price,
                    details=event.details,
                    recurrence=None,
                    recurrence_interval=None,
                    end_recurring_date=None
                )
                print(f"Added event: {event.name} on {future_date}")
            else:
                print(f"Skipped duplicate event: {event.name} on {future_date}")

    print("Future events populated successfully.")

# 🔹 **This is the missing class that makes Django recognize the command!**
class Command(BaseCommand):
    help = "Generate future recurring events up to a defined limit"

    def handle(self, *args, **kwargs):
        populate_future_events()
