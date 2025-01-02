from django.apps import AppConfig
from django_q.models import Schedule
from events.recurrence import populate_future_events

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

Schedule.objects.create(
    func='events.recurrence.populate_future_events',
    schedule_type=Schedule.WEEKLY,
)