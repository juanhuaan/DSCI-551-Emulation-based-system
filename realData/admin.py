from django.contrib import admin

# Register your models here.

from . import models

class RealDataAdmin(admin.ModelAdmin):
    pass

admin.site.register(models.Restaurants, RealDataAdmin);
admin.site.register(models.RestUser, RealDataAdmin);
admin.site.register(models.Rate, RealDataAdmin);
admin.site.register(models.City, RealDataAdmin);
