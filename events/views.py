from rest_framework import viewsets
from .models import Salsa
from .serializers import SalsaSerializer, EventPreviewSerializer
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
from rest_framework import status
from django.core.mail import send_mail

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
            today = timezone.now().date()
            logger.info(f"Fetching events from today ({today}) to 90 days later ({today + timezone.timedelta(days=90)})")
        
            # Remove the [:100] limit, keep the 90-day filter
            queryset = (
                Salsa.objects
                .filter(event_date__gte=today)
                .filter(event_date__lte=today + timezone.timedelta(days=90))
                .order_by('event_date')
                .only(
                    'id', 'name', 'event_date', 'time', 'location',
                    'image_url', 'source', 'price'
                )
            )
            logger.info(f"Queryset for list action: {queryset.query}")
            return queryset
        else:
            logger.info(f"Fetching all fields for detail view, action: {self.action}")
            return Salsa.objects.all()

    def list(self, request, *args, **kwargs):
        # Remove the [:100] limit here too
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class EventCalendarView(APIView):
    def get(self, request):
        events = Salsa.objects.all()
        event_list = []
        
        for event in events:
            logger.info(f"Event ID: {event.id}, Event Date: {event.event_date}")
            event_list.append({
                "title": event.name,
                "start": event.event_date,  # Will log the serialized value
                "location": event.location,
            })

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

class EventListView(APIView):
    def get(self, request):
        try:
            events = Salsa.objects.all()
            serializer = SalsaSerializer(events, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching events: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EventPreviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventPreviewSerializer
    
    def get_queryset(self):
        return (
            Salsa.objects
            .only('id', 'name', 'event_date', 'location')
            .order_by('event_date')
        )

@api_view(['POST'])
def send_contact_email(request):
    try:
        sender_email = request.data.get('email')
        message = request.data.get('message')
        name = request.data.get('name')
        
        # Format the email
        email_body = f"Message from: {name}\nEmail: {sender_email}\n\n{message}"
        
        send_mail(
            subject=f"Contact Form Message from {name}",
            message=email_body,
            from_email=sender_email,
            recipient_list=['abrahamvidalcastillo2@gmail.com'],  # Updated recipient
            fail_silently=False,
        )
        
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)

    
