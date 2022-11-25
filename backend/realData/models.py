from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class City(models.Model):
    name = models.CharField(max_length=255,primary_key=True)
    rank = models.IntegerField(default = -1)
    population = models.IntegerField()
    class Meta:
        abstract = True
        
class City0(City):
    pass
    class Meta:
        db_table='City0'
        
class City1(City):
    pass
    class Meta:
        db_table='City1'
        
class City2(City):
    pass
    class Meta:
        db_table='City2'
   
class Restaurants(models.Model):
    business_id = models.CharField(max_length = 255, primary_key=True)
    name = models.TextField(blank=True)
    rate = models.IntegerField()
    review_cnt = models.IntegerField()
    city = models.TextField(blank=True)
    latitude = models.FloatField(default=0)
    longitude =  models.FloatField(default=0)
    categories = models.TextField(blank=True)
    class Meta:
        abstract = True

class Rest0(Restaurants):
    pass
    class Meta:
        db_table='Rest0'
        
class Rest1(Restaurants):
    pass
    class Meta:
        db_table='Rest1'
        
class Rest2(Restaurants):
    pass
    class Meta:
        db_table='Rest2'



class RestUser(models.Model):
    id = models.CharField(max_length = 255, primary_key=True)
    name = models.TextField(blank=True)
    class Meta:
        abstract = True
        

class User0(RestUser):
    pass
    class Meta:
        db_table='User0'

class User1(RestUser):
    pass
    class Meta:
        db_table='User1'

class User2(RestUser):
    pass
    class Meta:
        db_table='User2'
        

class Rate(models.Model):
    userId = models.CharField(max_length = 255)
    restId = models.CharField(max_length = 255)
    score = models.IntegerField()
    class Meta:
        abstract = True
        

class Rate0(Rate):
    class Meta:
        db_table='Rate0'

class Rate1(Rate):
    class Meta:
        db_table='Rate1'

class Rate2(Rate):
    class Meta:
        db_table='Rate2'
