from django.shortcuts import render
from django.template import loader

# Create your views here.
#These functions will be called to render templates made in the 'templates' directory
from django.http import HttpResponse

def members(request):
    template = loader.get_template('myfirst.html') 
    return HttpResponse(template.render())
