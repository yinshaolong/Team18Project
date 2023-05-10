from django.urls import path, include
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('register/', register_user, name='register'),
    path('home/', home, name='home'),
    path('login/', MyLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'),name='logout'),
]

    # path('logout/', signout, name='logout'),