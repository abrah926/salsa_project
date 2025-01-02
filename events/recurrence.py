from datetime import date, timedelta
from .models import Salsa

def fetch_recurring_events():
    """
    Fetch recurring events from the database.
    """
    today = date.today()
    # Query all events with recurrence rules and a valid end_recurring_date
    return Salsa.objects.filter(
        recurrence__isnull=False,  # Events with a recurrence rule
        end_recurring_date__gte=today  # Recurrence has not ended
    )

def generate_future_dates(event):
    """
    Generate future dates based on the event's recurrence rules.
    """
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1
    end_date = event.end_recurring_date

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "DAILY":
            current_date += timedelta(days=interval)
        elif recurrence == "WEEKLY":
            current_date += timedelta(weeks=interval)
        elif recurrence == "MONTHLY":
            # Handle monthly increments
            next_month = (current_date.month % 12) + 1
            year_increment = (current_date.month + interval - 1) // 12
            current_date = current_date.replace(
                year=current_date.year + year_increment,
                month=next_month
            )
        else:
            break  # Unsupported recurrence type

        if current_date <= end_date:
            future_dates.append(current_date)

    return future_dates

def populate_future_events():
    """
    Fetch recurring events, generate future dates, and populate the database.
    """
    recurring_events = fetch_recurring_events()

    for event in recurring_events:
        future_dates = generate_future_dates(event)
        for date in future_dates:
            # Check if the event already exists for the date
            if not Salsa.objects.filter(name=event.name, event_date=date).exists():
                # Create a new event instance
                Salsa.objects.create(
                    name=event.name,
                    event_date=date,
                    time=event.time,
                    location=event.location,
                    source=event.source,
                    price=event.price,
                    details=event.details,
                    recurrence=None,  # Future events are non-recurring
                    recurrence_interval=None,
                    end_recurring_date=None
                )