from django.contrib import admin

# Register your models here.

from . import models

class HomeAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(models.Paths, HomeAdmin);