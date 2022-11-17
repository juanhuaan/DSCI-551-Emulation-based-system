from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class City(models.Model):
    name = models.CharField(max_length = 100, primary_key=True)
    rank = models.IntegerField(default = -1)
    population = models.IntegerField()
    class Meta:
        db_table='City'
    
class Restaurants(models.Model):
    busniss_id = models.CharField(max_length = 10, primary_key=True)
    name = models.CharField(max_length=20,default="")
    rate = models.IntegerField()
    review_cnt = models.IntegerField()
    city = models.CharField(max_length = 10)
    latitude = models.FloatField()
    longitude = models.CharField(max_length=10)
    categories = models.JSONField()
    class Meta:
        db_table='Restaurants'

class RestUser(models.Model):
    id = models.CharField(max_length = 30, primary_key=True)
    name = models.CharField(max_length=30)
    class Meta:
        db_table='RestUser'

class Rate(models.Model):
    userId = models.ForeignKey(RestUser,on_delete=models.CASCADE,related_name='_id')
    restId = models.ForeignKey(Restaurants,on_delete=models.CASCADE, related_name='bussiness_id')
    score = models.IntegerField()
    class Meta:
        db_table='Rate'

  
# name,rating score,review count,city,state,business id,latitude,longitude,categories