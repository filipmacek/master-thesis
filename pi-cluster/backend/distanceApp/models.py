from django.db import models

# Create your models here.

class User(models.Model):
    name=models.CharField(max_length=50)
    age=models.IntegerField(default=0)
    country=models.CharField(max_length=50)
