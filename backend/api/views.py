from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView,RetrieveUpdateAPIView,RetrieveUpdateDestroyAPIView
from .models import Name, Todo
from .serializers import NameSerializer, UserProfileSerializer, TodoSerializer
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
class NameListCreateView(ListCreateAPIView):
    queryset=Name.objects.all()
    serializer_class=NameSerializer
    permission_classes=[AllowAny]

    def create(self, request, *args, **kwargs):
        if request.user and request.user.is_authenticated:
            raise ValidationError('you are already signed up')
        return super().create(request, *args, **kwargs)

class NameDetailView(RetrieveAPIView):
    serializer_class=NameSerializer
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        try:
            return Name.objects.get(user=self.request.user)
        except Name.DoesNotExist:
            raise NotFound('Name object not found for this user.')

class UserProfileView(RetrieveUpdateAPIView):
    serializer_class=UserProfileSerializer

    def get_object(self):
        return self.request.user.name.profile

    def perform_update(self, serializer):
        serializer.save()

class TodoListCreateAPIView(ListCreateAPIView):
    serializer_class = TodoSerializer

    def get_queryset(self):
        return Todo.objects.filter(user_profile=self.request.user.name.profile)

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'name') or not hasattr(self.request.user.name, 'profile'):
            raise ValidationError("User profile does not exist.")
        serializer.save(user_profile=self.request.user.name.profile)

class TodoRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user_profile=self.request.user.name.profile)