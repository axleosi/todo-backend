from django.urls import path
from .views import NameListCreateView, NameDetailView, UserProfileView,TodoListCreateAPIView,TodoRetrieveUpdateDestroyAPIView

urlpatterns=[
    path('names/', NameListCreateView.as_view()),
    path('me/', NameDetailView.as_view()),
    path('profile/', UserProfileView.as_view()),
    path('todos/', TodoListCreateAPIView.as_view(), name='todo-list-create'), 
    path('todos/<int:pk>/', TodoRetrieveUpdateDestroyAPIView.as_view(), name='todo-detail'),
]