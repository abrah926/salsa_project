from rest_framework import viewsets
from .models import Salsa
from .serializers import SalsaSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
import logging
from rest_framework.decorators import api_view
from django.core.cache import cache
from django.conf import settings
from django.utils import timezone
from datetime import date

logger = logging.getLogger(__name__)

class SalsaViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions
    (list, create, retrieve, update, partial_update, destroy).
    """
    serializer_class = SalsaSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering = ['event_date']
    
    def get_queryset(self):
        if self.action == 'list':
            # For list view, use optimized query
            today = date.today()
            return (
                Salsa.objects
                .filter(event_date__gte=today)
                .filter(event_date__lte=today + timezone.timedelta(days=90))
                .order_by('event_date')
                .only(
                    'id', 'name', 'event_date', 'time', 'location',
                    'image_url', 'source', 'price'
                )
            )
        else:
            # For detail view, get all fields
            return Salsa.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()[:100]  # Limit to first 100 events
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class EventCalendarView(APIView):
    def get(self, request):
        events = Salsa.objects.all()
        event_list = [
            {
                "title": event.name,
                "start": event.event_date,
                "location": event.location,
                "latitude": event.map_location.latitude if hasattr(event, 'map_location') else None,
                "longitude": event.map_location.longitude if hasattr(event, 'map_location') else None,
            }
            for event in events
        ]
        return Response(event_list)

@api_view(['GET'])
def api_health_check(request):
    try:
        # Try to query your database
        event_count = Salsa.objects.count()
        return Response({
            "status": "healthy",
            "database": "connected",
            "event_count": event_count
        })
    except Exception as e:
        return Response({
            "status": "unhealthy",
            "error": str(e)
        }, status=500)


    
