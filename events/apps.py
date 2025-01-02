from django.apps import AppConfig

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    def ready(self):
        # Import necessary models and functions here
        from django_q.models import Schedule

        # Check if the schedule already exists to avoid duplicates
        if not Schedule.objects.filter(func='events.recurrence.populate_future_events').exists():
            Schedule.objects.create(
                func='events.recurrence.populate_future_events',
                schedule_type=Schedule.WEEKLY,
            )
