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
    events = Salsa.objects.filter(
        recurrence__in=["Weekly", "Monthly"],
        recurrence_interval__gte=1,
        event_date__lte=today
    )
    print(f"\nQuerying events with conditions:")
    print(f"- Recurrence in ['Weekly', 'Monthly']")
    print(f"- Recurrence interval >= 1")
    print(f"- Event date <= {today}")
    
    print(f"\nFound {events.count()} recurring events")
    
    # Debug: Show all events with recurrence
    all_recurring = Salsa.objects.exclude(recurrence__isnull=True)
    print(f"\nAll events with any recurrence: {all_recurring.count()}")
    for event in all_recurring:
        print(f"Event: {event.name}")
        print(f"- Date: {event.event_date}")
        print(f"- Recurrence: {event.recurrence}")
        print(f"- Interval: {event.recurrence_interval}")
    
    return events

def generate_future_dates(event, end_date):
    """Generate future dates based on the event's recurrence rules."""
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "Weekly":
            current_date += timedelta(weeks=interval)
        elif recurrence == "Monthly":
            current_date += relativedelta(months=interval)
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
    print("\nStarting to populate future events...")
    recurring_events = fetch_recurring_events()
    total_created = 0

    for event in recurring_events:
        event_end_date = event.end_recurring_date or MAX_FUTURE_LIMIT
        end_date = min(event_end_date, MAX_FUTURE_LIMIT)
        
        print(f"\nProcessing event: {event.name}")
        print(f"Start date: {event.event_date}")
        print(f"End date: {end_date}")

        future_dates = generate_future_dates(event, end_date)
        print(f"Generated {len(future_dates)} future dates")

        for future_date in future_dates:
            if future_date < MIN_FUTURE_LIMIT:
                print(f"Skipping date {future_date} - before minimum limit")
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
                print(f"Created event: {event.name} on {future_date}")
            else:
                print(f"Skipped duplicate event: {event.name} on {future_date}")

    print(f"\nTotal events created: {total_created}")

# 🔹 **This is the missing class that makes Django recognize the command!**
class Command(BaseCommand):
    help = "Generate future recurring events up to a defined limit"

    def handle(self, *args, **kwargs):
        populate_future_events()
