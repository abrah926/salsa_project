from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import CustomUser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class UserAPIView(APIView):
    @swagger_auto_schema(
        operation_summary="Retrieve all users",
        operation_description="This endpoint retrieves all users in the system.",
        responses={200: UserSerializer(many=True)}
    )
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Create a new user",
        operation_description="This endpoint allows you to create a new user.",
        request_body=UserSerializer,  # Attach the serializer for the request body
        responses={
            201: openapi.Response(
                description="User created successfully",
                examples={
                    "application/json": {
                        "message": "User created successfully",
                        "user_id": "64b47f6c8f29207f90056bcd"
                    }
                }
            ),
            400: "Validation error"
        }
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully",
                    "user_id": str(user.id)},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
