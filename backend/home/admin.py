from django.contrib import admin

# Register your models here.

from . import models

class HomeAdmin(admin.ModelAdmin):
    # list_display = ('name',)
    pass

admin.site.register(models.Paths, HomeAdmin);
admin.site.register(models.Relations, HomeAdmin);
admin.site.register(models.Part, HomeAdmin);