from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Name(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)

    def __str__(self):
        return self.user.username 
    
class UserProfile(models.Model):
    name=models.OneToOneField(Name, on_delete=models.CASCADE, related_name='profile')
    city=models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name.first_name}'s Profile"
    
class Todo(models.Model):
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user_profile = models.ForeignKey(UserProfile, related_name="todos", on_delete=models.CASCADE)

    def __str__(self):
        return f"Todo: {self.text} (Completed: {self.completed})"