from django.urls import path
from .views import UserAPIView

urlpatterns = [
    # API for creating and retrieving users
    path('users/', UserAPIView.as_view(), name='user-list-create'),
]
