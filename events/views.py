from rest_framework import viewsets
from .models import Salsa
from .serializers import SalsaSerializer

class SalsaViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions
    (list, create, retrieve, update, partial_update, destroy).
    """
    queryset = Salsa.objects.all()
    serializer_class = SalsaSerializer
