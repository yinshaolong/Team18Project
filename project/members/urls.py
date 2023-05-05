from django.urls import path, include
from .views import *

urlpatterns = [
    path('login_user/', login_user, name='login'),
    path('home/', home, name='home'),
    path('register/', register_user, name='register'),
    path('', home, name='home'),
    path('logout/', signout, name='logout'),
]
