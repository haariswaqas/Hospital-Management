from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateAPIView
from api.models import User, Profile, Appointment
from api.serializers import UserSerializer, ProfileSerializer, MyTokenObtainPairSerializer, RegisterSerializer, AppointmentSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # Directly pass role to the serializer to create the user with it
        user = serializer.save(role=self.request.data.get('role', 'Patient'))  # Default to 'Patient' if not specified

class ProfileView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role == 'Admin':
            return get_object_or_404(Profile, pk=self.kwargs.get('pk'))
        return user.profile  # Doctors and Patients can only access their own profile

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Role-based field validation
        if request.user.role != 'Admin':
            # Check if the user is trying to edit a different profile
            if instance.user != request.user:
                return Response({"detail": "You do not have permission to edit this profile."}, 
                                status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)  # Reusing PUT logic for POST

    def perform_update(self, serializer):
        serializer.save()

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_detail(request, pk):
    user = request.user

    # Fetch profile based on role
    if user.role in ['Admin', 'admin']:
        profile = get_object_or_404(Profile, pk=pk)  # Admin can access any profile
    elif user.role in ['Doctor', 'doctor']:
        profile = get_object_or_404(Profile, pk=pk)  # Doctors can access any profile
        # Check if the profile belongs to an Admin
        if profile.user.role in ['Admin', 'admin']:
            return Response({"detail": "You do not have permission to view this profile."},
                            status=status.HTTP_403_FORBIDDEN)
    elif user.role in ['Patient', 'patient']:
        profile = get_object_or_404(Profile, pk=pk)
        # Check if the profile belongs to an Admin or another Patient
        if profile.user.role in ['Admin', 'admin']:
            return Response({"detail": "You do not have permission to view this profile."},
                            status=status.HTTP_403_FORBIDDEN)

    # Handle GET request
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    # Handle PUT request
    elif request.method == 'PUT':
        # Check if the user is trying to edit their own profile
        if user.role not in ['Admin', 'admin']:
            if profile.user != user:
                return Response({"detail": "You do not have permission to edit this profile."},
                                status=status.HTTP_403_FORBIDDEN)

        request.data['user'] = request.user.id
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle DELETE request
    elif request.method == 'DELETE':
        # Allow Admins and users to delete their own profile
        if user.role in ['Admin', 'admin'] or profile.user == user:
            user_to_delete = profile.user
            profile.delete()
            user_to_delete.delete()  # Delete the associated User instance
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response({"detail": "You do not have permission to delete this profile."},
                        status=status.HTTP_403_FORBIDDEN)


# Appointment View
class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        
        print(f"Request Data: {self.request.data}")  # Debugging line
        doctor, patient = None, None

        # Case 1: If the user is a doctor, override the doctor field with the logged-in user
        if user.role == User.DOCTOR:
            doctor = user  # Set the doctor to the logged-in doctor
            patient_id = self.request.data.get('patient')
            if not patient_id:
                return Response({"detail": "Patient ID must be provided for doctor."}, status=status.HTTP_400_BAD_REQUEST)
            patient = get_object_or_404(User, pk=patient_id, role=User.PATIENT)

        # Case 2: If the user is a patient, override the patient field with the logged-in user
        elif user.role == User.PATIENT:
            patient = user  # Set the patient to the logged-in patient
            doctor_id = self.request.data.get('doctor')
            if not doctor_id:  # Check if doctor ID is provided
                return Response({"detail": "Doctor ID must be provided."}, status=status.HTTP_400_BAD_REQUEST)
            doctor = get_object_or_404(User, pk=doctor_id, role=User.DOCTOR)

        # Case 3: If the user is an admin, they can specify both the patient and doctor
        elif user.role == User.ADMIN:
            patient_id = self.request.data.get('patient')
            doctor_id = self.request.data.get('doctor')
            if not patient_id or not doctor_id:
                return Response({"detail": "Patient and Doctor IDs must be provided."}, status=status.HTTP_400_BAD_REQUEST)
            patient = get_object_or_404(User, pk=patient_id, role=User.PATIENT)
            doctor = get_object_or_404(User, pk=doctor_id, role=User.DOCTOR)

        # Check if the doctor is already booked for the requested date
        appointment_date = self.request.data.get('appointment_date')
        if Appointment.objects.filter(doctor=doctor, appointment_date=appointment_date).exists():
            return Response({"detail": "This doctor is already booked for this date."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the appointment with the appropriate patient and doctor
        serializer.save(patient=patient, doctor=doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)






# List all appointments for the logged-in user (doctor, patient, or admin)
class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # If the logged-in user is an admin, return all appointments
        if user.role == User.ADMIN:
            return Appointment.objects.all()

        # If the logged-in user is a doctor, return only their appointments
        elif user.role == User.DOCTOR:
            return Appointment.objects.filter(doctor=user)
        
        # If the logged-in user is a patient, return only their appointments
        elif user.role == User.PATIENT:
            return Appointment.objects.filter(patient=user)
        
        # If the user has any other role, return an empty queryset
        return Appointment.objects.none()


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the specific appointment instance
        appointment = get_object_or_404(Appointment, pk=self.kwargs.get('pk'))
        user = self.request.user
        
        # Allow a doctor to access their own appointments
        if user.role == User.DOCTOR and appointment.doctor != user:
            raise PermissionDenied("You do not have permission to modify this appointment.")
        
        # Allow a patient to access their own appointments
        if user.role == User.PATIENT and appointment.patient != user:
            raise PermissionDenied("You do not have permission to modify this appointment.")
        
        # Admins can modify any appointment
        if user.role == User.ADMIN:
            return appointment

        return appointment

    def perform_update(self, serializer):
        user = self.request.user

        # Allow the doctor or patient to modify specific fields including status
        if user.role == User.DOCTOR:
            serializer.save(doctor=user)  # This might be relevant if a doctor is changing the appointment
        elif user.role == User.PATIENT:
            serializer.save(patient=user)  # Patients are allowed to modify their own appointments
        else:
            serializer.save()  # Admins can modify anything

        # Allow status to be updated regardless of user role
        if 'status' in self.request.data:
            appointment = self.get_object()
            appointment.status = self.request.data['status']
            appointment.save()



# views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class PatientListView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users

    def get(self, request):
        # Allow both doctors and admins to view the patient list
        if request.user.role in [User.DOCTOR, User.ADMIN]:
            patients = User.objects.filter(role=User.PATIENT)
            serializer = UserSerializer(patients, many=True)
            return Response(serializer.data)

        # If user is not a doctor or admin, deny access
        return Response({"detail": "You are a Patient; you cannot view this list."}, status=403)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class PatientDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk, role=User.PATIENT)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        # Retrieve a specific patient profile
        patient = self.get_object(pk)
        if patient:
            serializer = UserSerializer(patient)
            return Response(serializer.data)
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        # Update a specific patient profile
        patient = self.get_object(pk)
        if patient:
            serializer = UserSerializer(patient, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Delete a specific patient profile
        patient = self.get_object(pk)
        if patient:
            patient.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    
class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        # Allow only Admins to view Full Doctors List
        if request.user.role == User.ADMIN or request.user.role == User.PATIENT or request.user.role == User.DOCTOR:
            doctors = User.objects.filter(role=User.DOCTOR)
            serializer = UserSerializer(doctors, many=True)
            return Response(serializer.data)
        else:
        
        # If user is not a Doctor or Patient, deny access
            return Response({"detail": "You are not an Admin; you cannot view this list."}, status=403)
        

class DoctorDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk, role=User.DOCTOR)  # Get the doctor by primary key
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        doctor = self.get_object(pk)
        if doctor is not None:
            serializer = UserSerializer(doctor)
            return Response(serializer.data)
        return Response({"detail": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        doctor = self.get_object(pk)
        if doctor is not None:
            serializer = UserSerializer(doctor, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()  # Save the updated data
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        doctor = self.get_object(pk)
        if doctor is not None:
            doctor.delete()  # Delete the doctor record
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)