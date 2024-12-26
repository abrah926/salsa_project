from django.urls import path, include
from .views import SalsaViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'salsas', SalsaViewSet, basename='salsa')

urlpatterns = [
    path('', include(router.urls)),
]
