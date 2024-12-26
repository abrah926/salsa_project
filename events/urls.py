from django.urls import path
from .views import SalsaListCreateView

urlpatterns = [
    path('salsas/', SalsaListCreateView.as_view(), name='salsa-list-create'),
]
