from django.db import models

class Paths(models.Model):
    inode = models.CharField(max_length = 254, primary_key=True)
    TYPE_CHOICES = (
        ("FILE", "FILE"),
        ("DIRECTORY", "DIRECTORY"),
    )
    pathType = models.CharField(max_length=9,
                  choices=TYPE_CHOICES,
                  default="FILE")

    # pathType = models.CharField(max_length=10, default="DIRECTORY")
    name = models.TextField()
    class Meta:
        db_table='Paths'

class Relations(models.Model):
    parent = models.ForeignKey(Paths,on_delete=models.CASCADE,related_name='parentInode')
    child = models.ForeignKey(Paths,on_delete=models.CASCADE, related_name='childInode')
    class Meta:
        db_table='Relations'

class Part(models.Model):
    # id is inode from Paths
    inode = models.ForeignKey(Paths, on_delete=models.CASCADE)
    location = models.CharField(max_length = 200)
    class Meta:
        db_table='Part'


