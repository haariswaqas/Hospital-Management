from django.contrib import admin
from api.models import User, Profile, Appointment

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'first_name', 'middle_name', 'last_name',
        'gender', 'phone_number', 'address',
        'date_of_birth', 'age',
        'medical_history', 'specialization',
        'consultation_fees', 'license_number'
    ]
    
    list_editable = [
        'first_name', 'middle_name', 'last_name',
        'gender', 'phone_number', 'address',
        'date_of_birth', 'age',
        'medical_history', 'specialization',
        'consultation_fees', 'license_number'
    ]

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Appointment)