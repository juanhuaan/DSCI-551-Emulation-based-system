from rest_framework import serializers
from .models import City0, Rest0, User0, Rate0

class RestaurantSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rest0
        fields =['business_id', 'name', 'rate', 'review_cnt', 'city', 
                 'latitude', 'longitude', 'categories']

class CitySpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = City0
        fields =['name', 'rank', 'population']

class UserSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User0
        fields =['id', 'name']
        
class RateSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rate0
        fields =['userId', 'restId', 'score']



        

            