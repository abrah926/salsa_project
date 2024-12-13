from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Swagger Schema View
schema_view = get_schema_view(
    openapi.Info(
        title="Salsa API",
        default_version='v1',
        description="API documentation for the Salsa project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@salsa.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include app-level URLs from the `events` app
    path('api/', include('events.urls')),
    re_path(r'^swagger/$', schema_view.with_ui('swagger',
            cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc',
            cache_timeout=0), name='schema-redoc'),
]
