from .models import Name, UserProfile, Todo
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError

class NameSerializer(serializers.ModelSerializer):
    username=serializers.CharField(write_only=True)
    password=serializers.CharField(write_only=True)

    class Meta:
        model=Name
        fields=['id','username','first_name','last_name','password',]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise ValidationError(f"Username {value} is already taken.")
        return value

    def create(self, validated_data):
        username=validated_data.pop('username')
        first_name=validated_data.pop('first_name')
        last_name=validated_data.pop('last_name')
        password=validated_data.pop('password')

        if User.objects.filter(username=username).exists():
           raise ValidationError(f"Username {username} is already taken.")

        user=User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password
        )

        name=Name.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name
        )
        UserProfile.objects.get_or_create(name=name, city="")

        refresh=RefreshToken.for_user(user)
        name.token={
            'refresh':str(refresh),
            'access':str(refresh.access_token),
        }
        return name

    def to_representation(self, instance):
        representation=super().to_representation(instance)
        if hasattr(instance, 'token'):
            representation['token']=instance.token
        return representation

class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = ['id', 'text', 'completed']


class UserProfileSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)
    first_name = serializers.CharField(source='name.first_name', read_only=True)
    last_name = serializers.CharField(source='name.last_name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['city','first_name', 'last_name', 'todos']