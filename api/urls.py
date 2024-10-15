from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views

urlpatterns = [
    # JWT Token endpoints
    path("token/", views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),

    # Registration endpoint
    path("register/", views.RegisterView.as_view(), name='register'),

    # Profile endpoints
    path("profile/", views.ProfileView.as_view(), name='profile'),  # For retrieving/updating the logged-in user's profile
    path("profile/<int:pk>/", views.ProfileView.as_view(), name='profile_detail'),  # For retrieving/updating/deleting specific profiles

    # Appointment endpoints
    path("appointments/", views.AppointmentListView.as_view(), name='appointment_list'),  # List all appointments for the logged-in user
    path("appointments/create/", views.AppointmentCreateView.as_view(), name='appointment_create'),  # Create a new appointment
    path("appointments/<int:pk>/", views.AppointmentDetailView.as_view(), name='appointment_detail'), # PUT, DELETE, GET by ID
    
    
    # Patient list endpoint (only accessible by doctors)
    path("patients/", views.PatientListView.as_view(), name='patient_list'),
    path("patient/<int:pk>/", views.PatientDetailView.as_view(), name="patient_detail"),
    
    # Doctor list endpoint (only accessible by admins)
    path("doctors/", views.DoctorListView.as_view(), name='doctor_list'),
    path("doctor/<int:pk>/", views.DoctorDetailView.as_view(), name="doctor_detail")
]
