from django.contrib import admin

# Register your models here.

from . import models

class RealDataAdmin(admin.ModelAdmin):
    pass

admin.site.register(models.Rest0, RealDataAdmin);
admin.site.register(models.Rest1, RealDataAdmin);
admin.site.register(models.Rest2, RealDataAdmin);
admin.site.register(models.User0, RealDataAdmin);
admin.site.register(models.User1, RealDataAdmin);
admin.site.register(models.User2, RealDataAdmin);
admin.site.register(models.City0, RealDataAdmin);
admin.site.register(models.City1, RealDataAdmin);
admin.site.register(models.City2, RealDataAdmin);

