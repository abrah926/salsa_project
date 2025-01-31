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
            logger.info(f"Request headers: {request.headers}")
            logger.info(f"Request META: {request.META}")
            
            response = super().list(request, *args, **kwargs)
            logger.info(f"Response data count: {len(response.data)}")
            return response
        except Exception as e:
            logger.error(f"Error fetching events: {str(e)}", exc_info=True)
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


    
