from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
# Create your models here.
#This is the main data base. We can add new members to our database using predefined attributes here
#A model is simply a table in your database
#in the 'Project' directory, you can run 'py manage.py makemigrations members' and then 'py manage.py migrate' to create the tables based on the models below
#The 

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    user_id = models.IntegerField(primary_key=True,serialize=False, verbose_name= 'User ID', unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(verbose_name = 'Email Address',max_length=255, unique=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']

class Location(models.Model):
    location_id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='Location ID',unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude= models.DecimalField(max_digits=9, decimal_places=6)

class Itinerary(models.Model):
    itinerary_id = models.IntegerField(primary_key=True,serialize=False, verbose_name= 'Itinerary ID', unique=True)
    location_list = models.ManyToManyField(Location)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    travel_time = models.DateTimeField()
    
class Business(models.Model):
    LODGING = 'Lodging'
    RESTAURANTS = 'Restaurants'
    THINGS_TO_DO = 'Things To Do'
    BUSINESS_TYPES = [
        (LODGING, 'Lodging'),
        (RESTAURANTS, 'Restaurants'),
        (THINGS_TO_DO, 'Things to do')
    ]
    business_id = models.IntegerField(primary_key=True, serialize=False, verbose_name='Business ID', unique=True)
    business_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=12, choices=BUSINESS_TYPES)
    pricerange = models.IntegerField()
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)

