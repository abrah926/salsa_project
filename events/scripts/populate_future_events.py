import os
import django

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salsa.settings')


# Initialize Django
django.setup()

from events.recurrence import populate_future_events

def run():
    """
    Script to populate future events based on recurrence rules.
    """
    populate_future_events()
    print("Future events populated successfully.")

if __name__ == "__main__":
    run()
