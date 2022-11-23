from django.urls import path
from django.conf.urls import include
from .views import RestView,CityView,UserView,RateView
from rest_framework.routers import DefaultRouter

# router = DefaultRouter();
# router.register('restaurants', RestView, basename = 'restaurants');

urlpatterns = [
    path('restaurants/', RestView.as_view()),
    path('city/', CityView.as_view()),
    path('restUser/', UserView.as_view()),
    path('rate/', RateView.as_view()),
]