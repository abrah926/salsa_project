from django.urls import path, include
from .views import SalsaViewSet, EventCalendarView, api_health_check
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Create a router instance
router = DefaultRouter()
router.register(r'events', SalsaViewSet, basename='event')  # Changed from 'salsas' to 'events'


# Swagger schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Salsa Events API",
        default_version="v1",
        description="API documentation for the Salsa Events app.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="your-email@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include(router.urls)),  # This will include /events/
    path('calendar/', EventCalendarView.as_view(), name='event-calendar'),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path('health/', api_health_check, name='api_health_check'),
]
