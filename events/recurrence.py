from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from .models import Salsa

# Define limits for future dates
MAX_FUTURE_LIMIT = date.today() + timedelta(days=365)  # 1 year
MIN_FUTURE_LIMIT = date.today() + timedelta(days=6 * 30)  # 6 months


def fetch_recurring_events():
    """
    Fetch recurring events from the database.
    """
    today = date.today()
    # Query all events with recurrence rules
    return Salsa.objects.filter(
        recurrence__in=["WEEKLY", "MONTHLY"],  # Include only supported recurrence types
        recurrence_interval=1,  # Include only events with interval = 1
        event_date__lte=today  # Include only events starting today or earlier
    )


def generate_future_dates(event, end_date):
    """
    Generate future dates based on the event's recurrence rules.
    """
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1  # Default to 1 if None

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "WEEKLY":
            current_date += timedelta(weeks=interval)
        elif recurrence == "MONTHLY":
            # Use relativedelta to handle monthly increments correctly
            current_date += relativedelta(months=interval)
        else:
            break  # Skip unsupported recurrence types

        if current_date <= end_date:
            future_dates.append(current_date)

    return future_dates


def populate_future_events():
    """
    Fetch recurring events, generate future dates up to a defined limit, and populate the database.
    """
    print("Starting to populate future events...")
    recurring_events = fetch_recurring_events()

    for event in recurring_events:
        # Determine the end date for recurrence
        event_end_date = event.end_recurring_date or MAX_FUTURE_LIMIT
        end_date = min(event_end_date, MAX_FUTURE_LIMIT)  # Respect the 1-year limit

        # Generate future dates
        future_dates = generate_future_dates(event, end_date)

        for future_date in future_dates:
            # Ensure that future dates are at least 6 months from today
            if future_date < MIN_FUTURE_LIMIT:
                continue

            # Check if the event already exists for the date
            if not Salsa.objects.filter(name=event.name, event_date=future_date).exists():
                # Create a new event instance
                Salsa.objects.create(
                    name=event.name,
                    event_date=future_date,
                    time=event.time,
                    location=event.location,
                    source=event.source,
                    price=event.price,
                    details=event.details,
                    recurrence=None,  # Future events are non-recurring
                    recurrence_interval=None,
                    end_recurring_date=None
                )
                print(f"Added event: {event.name} on {future_date}")
            else:
                print(f"Skipped duplicate event: {event.name} on {future_date}")

    print("Future events populated successfully.")
