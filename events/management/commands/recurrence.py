from datetime import date, timedelta
from dateutil.relativedelta import relativedelta, MO, TU, WE, TH, FR, SA, SU
from django.core.management.base import BaseCommand
from events.models import Salsa

# Define limits for future dates
MAX_FUTURE_LIMIT = date.today() + timedelta(days=365)  # 1 year
MIN_FUTURE_LIMIT = date.today() + timedelta(days=6 * 30)  # 6 months

def fetch_recurring_events():
    """Fetch recurring events from the database."""
    today = date.today()
    events = Salsa.objects.filter(
        recurrence__in=["Weekly", "Monthly"],
        recurrence_interval__gte=1,
        event_date__lte=today
    )
    return events

def generate_future_dates(event, end_date):
    """Generate future dates based on the event's recurrence rules and ensure they fall on the correct weekday."""
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "Weekly":
            # Move forward by 'interval' weeks
            current_date += timedelta(weeks=interval)
            # Ensure the date matches the original weekday
            correct_weekday = start_date.weekday()  # 0 = Monday, 6 = Sunday
            current_date = current_date + timedelta((correct_weekday - current_date.weekday()) % 7)

        elif recurrence == "Monthly":
            current_date += relativedelta(months=interval)
            # Ensure the new date falls on the same weekday as the original event
            correct_weekday = start_date.weekday()
            while current_date.weekday() != correct_weekday:
                current_date += timedelta(days=1)  # Move forward until it matches

        else:
            break  # Skip unsupported recurrence types

        if current_date <= end_date:
            future_dates.append(current_date)

    print(f"Debug: Generating dates for {event.name}")
    print(f"- Start date: {start_date}")
    print(f"- End date: {end_date}")
    print(f"- Recurrence: {recurrence}")
    print(f"- Interval: {interval}")

    return future_dates

def populate_future_events():
    """Generate future events without duplication."""
    recurring_events = fetch_recurring_events()
    total_created = 0

    for event in recurring_events:
        event_end_date = event.end_recurring_date or MAX_FUTURE_LIMIT
        end_date = min(event_end_date, MAX_FUTURE_LIMIT)
        
        future_dates = generate_future_dates(event, end_date)

        for future_date in future_dates:
            if future_date < MIN_FUTURE_LIMIT:
                continue

            exists = Salsa.objects.filter(name=event.name, event_date=future_date).exists()
            if not exists:
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
                total_created += 1

    return total_created

class Command(BaseCommand):
    help = "Generate future recurring events up to a defined limit"

    def handle(self, *args, **kwargs):
        total = populate_future_events()
        self.stdout.write(self.style.SUCCESS(f'Successfully created {total} future events'))
