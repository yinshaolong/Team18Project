from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from members.models import User

class LoginForm(UserCreationForm):
    username = forms.CharField(max_length=65,label="Username")
    password = forms.CharField(max_length=65, label="Password",widget=forms.PasswordInput)






class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ['username', 'password']
