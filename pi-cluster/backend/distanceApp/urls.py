from django.conf.urls import url
from django.urls import path
from .views import UserList,UserListCreate

urlpatterns=[
    path('users/', UserList.as_view()),
    path('users/create/',UserListCreate.as_view())
]
