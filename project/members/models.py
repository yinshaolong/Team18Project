from django.db import models

# Create your models here.
#This is the main data base. We can add new members to our database using predefined attributes here
#A model is simply a table in your database
#in the 'Project' directory, you can run 'py manage.py makemigrations members' and then 'py manage.py migrate' to create the tables based on the models below
#The 

class User(models.Model):
    user_id = models.IntegerField(primary_key=True,serialize=False, verbose_name= 'User ID', unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    
    
class Location(models.Model):
    location_id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='Location ID',unique=True)
    latitude = models.IntegerField()
    longitude= models.IntegerField()

class Itinerary(models.Model):
    itinerary_id = models.IntegerField(primary_key=True,serialize=False, verbose_name= 'Itinerary ID', unique=True)
    location_list = models.ManyToManyField(Location)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    travel_time = models.DateTimeField()
    
class Business(models.Model):
    business_id = models.IntegerField(primary_key=True, serialize=False, verbose_name='Business ID', unique=True)
    business_name = models.CharField(max_length=255)
    pricerange = models.IntegerField()
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
