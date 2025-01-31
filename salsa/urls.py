from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.shortcuts import redirect
from django.http import JsonResponse

# Swagger Schema Configuration
schema_view = get_schema_view(
    openapi.Info(
        title="Salsa Events API",
        default_version='v1',
        description="API documentation for the Salsa Events application",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="your_email@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=None,  # Remove the hardcoded URL
    patterns=[
        path('api/', include('events.urls')),  # Include your API patterns
    ],
)

def root_view(request):
    """
    Root view redirects to Swagger UI for better usability.
    """
    return redirect('/swagger/')

def health_check(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/', include('events.urls')),  # Add this back
    path('', lambda request: redirect('swagger/')),  # Redirect root to swagger
]
