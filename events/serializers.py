from rest_framework import serializers
from .models import CustomUser
from .services import create_user


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name',
                  'email', 'password', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_id(self, obj):
        # Convert MongoDB ObjectId to string for JSON responses
        return str(obj.id)

    def create(self, validated_data):

        return create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )