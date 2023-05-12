from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, logout, login as auth_login
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy 
from django.http import HttpResponse
from project.settings import GOOGLE_API_KEY
from .models import User, Business, Itinerary
from .forms import ItineraryForm
# from django.contrib.auth.models import User
# from django.template import loader
# from django.contrib.auth.decorators import login_required
# Create your views here.
#These functions will be called to render templates made in the 'templates' directory

class MyLoginView(LoginView):
    redirect_authenticated_user = True
    
    def get_success_url(self):
        return reverse_lazy('home') 
    
    def form_invalid(self, form):
        messages.error(self.request,'Invalid username or password')
        return self.render_to_response(self.get_context_data(form=form))
        


def register_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=raw_password)
            auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, "There was an error creating the user. Please try again.")
    else:
        form = UserCreationForm()
    return render(request, 'registration/createuser.html', {'form': form})
    

def home(request):
    if request.user.is_authenticated:
        context = {'key': GOOGLE_API_KEY}
        return render(request, 'registration/home.html', context)
    else:
        return redirect('login')
        
# def login_user(request):
#     if request.user.is_authenticated:
#         return redirect('home')
#     else:
#         if request.method == 'POST':
#             username = request.POST["username"]
#             password = request.POST["password"]
#             user = authenticate(request, username=username, password=password)
#             if user is not None:
#                 auth_login(request, user)
#                 messages.success(request, f"User has been authenticated. Welcome {user.get_username()}!")
#                 return redirect('home')
#             else:
#                 messages.error(request, "There was an error logging in. Please try again...")
#                 return render(request, 'registration/login.html')
#         else:
#             return render(request, 'registration/login.html', {})

# def signout(request):
#     if request.user.is_authenticated:
#         logout(request)
#         messages.success(request, "You have been logged out! :)")
#         return redirect('registration/login.html')
#     else:
#         return redirect('home')



def create_itinerary(request, itinerary_id=None):
    itinerary = get_object_or_404(Itinerary, itinerary_id=itinerary_id) if itinerary_id else None

    if request.method == 'POST':
        form = ItineraryForm(request.POST, instance=itinerary)
        if form.is_valid():
            itinerary = form.save(commit=False)
            itinerary.user_id = request.user  # Assign the currently logged-in user
            itinerary.save()
            return redirect('itinerary_list')
    else:
        # Set the initial data for the form
        initial_data = {'user_id': request.user}
        form = ItineraryForm(instance=itinerary, initial=initial_data)

    return render(request, 'itinerary_form.html', {'form': form})
    
def itinerary_list(request):
    itineraries = Itinerary.objects.all()
    return render(request, 'itinerary_list.html', {'itineraries': itineraries})

def itinerary_detail(request, itinerary_id):
    itinerary = get_object_or_404(Itinerary, itinerary_id=request.user.id)
    return render(request, 'itinerary_detail.html', {'itinerary': itinerary})
    
def delete_itinerary(request, itinerary_id):
    itinerary = get_object_or_404(Itinerary, itinerary_id=itinerary_id)
    itinerary.delete()
    return redirect('itinerary_list')
