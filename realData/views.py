from django.shortcuts import render
from .models import City, Restaurants, RestUser, Rate
from django.contrib import admin
from rest_framework.response import Response
from rest_framework.views import APIView
# Create your views here.


class RestaurantView(APIView):
    # upload a restaurant
    
    def get(self, request):
        restaurants = Restaurants.objects.all();
        return Response({"restaurants": restaurants})
