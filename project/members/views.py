from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, logout, login as auth_login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.template import loader
from django.contrib.auth.models import User
# Create your views here.
#These functions will be called to render templates made in the 'templates' directory
from django.http import HttpResponse
from project.settings import GOOGLE_API_KEY

def login_user(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            messages.success(request, f"User has been authenticated. Welcome {user.get_username()}!")
            return redirect('home')
        else:
            messages.error(request, "There was an error logging in. Please try again...")
            return redirect('login')
    else:
        return render(request, 'registration/login.html', {})

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

def signout(request):
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, "You have been logged out!")
        return redirect('logout')
    else:
        return redirect('home')


def home(request):
    if request.user.is_authenticated:
        context = {'key': GOOGLE_API_KEY}
        return render(request, 'registration/home.html', context)
    else:
        return redirect('login')
        

def write(request):
    pass