from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from datetime import date

class User(AbstractUser): 
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    
    # Defining User Roles for Hospital/Clinic
    ADMIN = 'admin'
    PATIENT = 'patient'
    DOCTOR = 'doctor'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'), 
        (PATIENT, 'Patient'),
        (DOCTOR, 'Doctor'),
    ]
    
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default=PATIENT)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    def __str__(self):
        return self.username


class Profile(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Common Fields for All Users
    first_name = models.CharField(max_length=100, null=True, blank=True)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Patient-Specific Fields
    medical_history = models.TextField(null=True, blank=True)
    
    # Doctor-specific Fields
    specialization = models.CharField(max_length=100, null=True, blank=True)
    consultation_fees = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    license_number = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return f'{self.user.username} Profile'
    
    # Override the save method to calculate age based on date_of_birth
    def save(self, *args, **kwargs):
        if self.date_of_birth:
            today = date.today()
            self.age = today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        super().save(*args, **kwargs)


# Signal to create or save a profile when a User is created or saved
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('canceled', 'Canceled'),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_as_patient', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_as_doctor', limit_choices_to={'role': 'doctor'})
    appointment_date = models.DateTimeField()
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Appointment on {self.appointment_date} - {self.patient.username} with {self.doctor.username}'