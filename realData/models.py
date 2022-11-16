from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class City(models.Model):
    name = models.CharField(max_length = 10, primary_key=True)
    rank = models.IntegerField(default = -1)
    population = models.IntegerField(max_length=20)
    class Meta:
        db_table='City'
    
class Restaurants(models.Model):
    id = models.CharField(max_length = 30, primary_key=True)
    name = models.ForeignKey(City,on_delete=models.CASCADE)
    rate = models.IntegerField(default = -1)
    review_cnt = models.IntegerField(max_length=200)
    city = models.CharField(max_length=20)
    latitude = models.FloatField()
    longitude = models.CharField(max_length=20)
    categories = ArrayField(
            models.CharField(max_length=10, blank=True),
            size=8,
    )
    class Meta:
        db_table='Restaurants'

class User(models.Model):
    id = models.CharField(max_length = 30, primary_key=True)
    name = city = models.CharField(max_length=10)
    class Meta:
        db_table='User'

class Rate(models.Model):
    userId = models.ForeignKey(User,on_delete=models.CASCADE)
    restId = models.ForeignKey(Restaurants,on_delete=models.CASCADE)
    score = models.IntegerField(max_length=10)
    class Meta:
        db_table='Rate'


    
    


    
    
    
    
    
# name,rating score,review count,city,state,business id,latitude,longitude,categories