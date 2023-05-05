from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.template import loader
from django.contrib.auth.models import User
# Create your views here.
#These functions will be called to render templates made in the 'templates' directory
from django.http import HttpResponse


def login_user(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.success(request, "There was an error logging in. Please try again...")
            return render(request, 'registration.login.html', {}) 

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
            login(request, user)
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
    return redirect('login')


def home(request):
    if request.user.is_authenticated:
        return render(request, 'registration/home.html')
    else:
        return redirect('login')