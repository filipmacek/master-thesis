from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import User
from .serializers import UserSerializer



# Create your views here.
class UserList(ListAPIView):
    queryset= User.objects.all()
    serializer_class= UserSerializer

class UserListCreate(CreateAPIView):
    queryset= User.objects.all()
    serializer_class= UserSerializer


