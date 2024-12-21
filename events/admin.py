from django.contrib import admin
from .models import Salsa

@admin.register(Salsa)
class SalsaAdmin(admin.ModelAdmin):
    list_display = ('name', 'event_date', 'time', 'location', 'price')
