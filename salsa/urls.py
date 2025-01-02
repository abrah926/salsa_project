from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.shortcuts import redirect

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
)

def root_view(request):
    """
    Root view redirects to Swagger UI for better usability.
    """
    return redirect('/swagger/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('events.urls')),  # Link to app-level URLs
    path('', root_view, name='root'),  # Root route redirects to Swagger
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
