from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from events.models import Salsa
import os

# Define limits for future dates
MAX_FUTURE_LIMIT = date.today() + timedelta(days=365)  # 1 year
MIN_FUTURE_LIMIT = date.today()  # Start from today instead of 6 months ahead

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
    return events

def generate_future_dates(event, end_date):
    """Generate future dates based on the event's recurrence rules."""
    start_date = event.event_date
    recurrence = event.recurrence
    interval = event.recurrence_interval or 1
    target_weekday = start_date.weekday()  # Remember original weekday (0=Monday, 6=Sunday)

    future_dates = []
    current_date = start_date

    while current_date <= end_date:
        if recurrence == "Weekly":
            # For weekly events, simply add weeks
            current_date += timedelta(weeks=interval)
        elif recurrence == "Monthly":
            # For monthly events, add months then adjust to correct weekday
            next_date = current_date + relativedelta(months=interval)
            
            # Calculate the same week of the month
            original_week = (start_date.day - 1) // 7
            next_month_start = next_date.replace(day=1)
            
            # Find the first occurrence of the target weekday
            days_ahead = target_weekday - next_month_start.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            target_day = next_month_start + timedelta(days=days_ahead)
            
            # Move to the correct week
            current_date = target_day + timedelta(weeks=original_week)
            
            # If we went too far into next month, go back a week
            if current_date.month != next_month_start.month:
                current_date -= timedelta(weeks=1)
        else:
            break

        if current_date <= end_date:
            future_dates.append(current_date)

    print(f"Debug: Generating dates for {event.name}")
    print(f"- Start date: {start_date} ({start_date.strftime('%A')})")
    print(f"- End date: {end_date}")
    print(f"- Recurrence: {recurrence}")
    print(f"- Interval: {interval}")
    print(f"- Target weekday: {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][target_weekday]}")

    return future_dates

def save_to_log(message, filename="event_generation.log"):
    """Save output to a log file"""
    with open(filename, 'a') as f:
        f.write(f"{message}\n")

def print_paginated(messages, lines_per_page=50):
    """Print messages with pagination"""
    total_lines = len(messages)
    current_line = 0
    
    while current_line < total_lines:
        # Print a page of messages
        for line in messages[current_line:current_line + lines_per_page]:
            print(line)
        
        current_line += lines_per_page
        
        if current_line < total_lines:
            response = input("\nPress Enter for next page, 'q' to quit, 's' to save to file: ")
            if response.lower() == 'q':
                break
            elif response.lower() == 's':
                save_to_log('\n'.join(messages))
                print(f"\nOutput saved to event_generation.log")
                break

def populate_future_events():
    """Generate future events without duplication."""
    output_messages = []
    output_messages.append("\nStarting to populate future events...")
    recurring_events = fetch_recurring_events()
    total_created = 0

    for event in recurring_events:
        event_end_date = event.end_recurring_date or MAX_FUTURE_LIMIT
        end_date = min(event_end_date, MAX_FUTURE_LIMIT)
        
        output_messages.append(f"\nProcessing event: {event.name}")
        output_messages.append(f"Start date: {event.event_date}")
        output_messages.append(f"End date: {end_date}")

        future_dates = generate_future_dates(event, end_date)
        output_messages.append(f"Generated {len(future_dates)} future dates")

        for future_date in future_dates:
            if future_date < MIN_FUTURE_LIMIT:
                output_messages.append(f"Skipping date {future_date} - before today")
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
                output_messages.append(f"Created event: {event.name} on {future_date} ({future_date.strftime('%A')})")
            else:
                output_messages.append(f"Skipped duplicate event: {event.name} on {future_date}")

    output_messages.append(f"\nTotal events created: {total_created}")
    return output_messages

class Command(BaseCommand):
    help = "Generate future recurring events up to a defined limit"

    def add_arguments(self, parser):
        parser.add_argument(
            '--save',
            action='store_true',
            help='Save output to a log file',
        )

    def handle(self, *args, **options):
        messages = populate_future_events()
        if options['save']:
            save_to_log('\n'.join(messages))
            self.stdout.write(self.style.SUCCESS(f'Output saved to event_generation.log'))
        else:
            print_paginated(messages)
