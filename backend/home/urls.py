from django.urls import path
from django.conf.urls import include
from .views import CommandView

urlpatterns = [
    path('commands/', CommandView.as_view()),
   
]



