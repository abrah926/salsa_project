from rest_framework import serializers
from .models import Salsa

class SalsaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salsa
        fields = '__all__'  # Includes all fields of the Salsa model
