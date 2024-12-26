from django.shortcuts import render

from rest_framework import generics
from .models import Salsa
from .serializers import SalsaSerializer

class SalsaListCreateView(generics.ListCreateAPIView):
    queryset = Salsa.objects.all()
    serializer_class = SalsaSerializer

