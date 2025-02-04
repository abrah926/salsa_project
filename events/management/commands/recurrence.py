from datetime import date, timedelta
from dateutil.relativedelta import relativedelta, MO, TU, WE, TH, FR, SA, SU

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
