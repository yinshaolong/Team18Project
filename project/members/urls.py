from django.urls import path, include
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('register/', register_user, name='register'),
    path('home/', home, name='home'),
    path('login/', MyLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'),name='logout'),
    path('business/new/', create_business_from_req, name='business'),
    path('itineraries/', itinerary_list, name='itinerary_list'),
    path('itineraries/<int:itinerary_id>/', itinerary_detail, name='itinerary_detail'),
    path('itineraries/<int:itinerary_id>/delete/', delete_itinerary, name='delete_itinerary'),

]
    # path('itineraries/new/', create_itinerary, name='create_itinerary'),

    # path('logout/', signout, name='logout'),