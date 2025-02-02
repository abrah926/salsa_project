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

logger = logging.getLogger(__name__)

class SalsaViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions
    (list, create, retrieve, update, partial_update, destroy).
    """
    queryset = Salsa.objects.all()
    serializer_class = SalsaSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['event_date', 'location', 'recurrence']
    ordering_fields = ['event_date', 'name']
    ordering = ['event_date']

    def list(self, request, *args, **kwargs):
        try:
            # Try to get from cache first
            cache_key = 'events_list'
            try:
                cached_data = cache.get(cache_key)
                if cached_data is not None:
                    return Response(cached_data)
            except Exception as cache_error:
                logger.error(f"Cache error: {str(cache_error)}")
                # Continue without cache if there's an error
            
            # Get data from DB
            response = super().list(request, *args, **kwargs)
            
            # Try to cache the response
            try:
                cache.set(cache_key, response.data, timeout=settings.CACHE_TTL)
            except Exception as cache_error:
                logger.error(f"Cache set error: {str(cache_error)}")
                # Continue even if caching fails
            
            return response
        except Exception as e:
            logger.error(f"Error in events list: {str(e)}", exc_info=True)
            return JsonResponse(
                {"error": "Internal server error", "details": str(e)}, 
                status=500
            )

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


    
