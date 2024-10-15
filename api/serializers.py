from api.models import User, Profile, Appointment
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'  # Include all fields, including age and date_of_birth

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Customize output based on user role
        if instance.user.role == User.DOCTOR:
            representation['specialization'] = instance.specialization
            representation['license_number'] = instance.license_number
            representation['consultation_fees'] = str(instance.consultation_fees)
        elif instance.user.role == User.PATIENT:
            representation['medical_history'] = instance.medical_history

        return representation

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
     
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile']  # Added role field


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role  # Include the user's role

        if hasattr(user, 'profile'):
            token['first_name'] = user.profile.first_name
            token['middle_name'] = user.profile.middle_name
            token['last_name'] = user.profile.last_name
            token['age'] = user.profile.age  # Include age
            token['date_of_birth'] = str(user.profile.date_of_birth) if user.profile.date_of_birth else None

            if user.role == User.DOCTOR:
                token['specialization'] = user.profile.specialization
                token['license_number'] = user.profile.license_number
                token['consultation_fees'] = str(user.profile.consultation_fees)

            if user.role == User.PATIENT:
                token['medical_history'] = user.profile.medical_history

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True
    )
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)  # Add role to the registration

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'role']  # Include role in registration

    def validate(self, attrs):
        # Check if the username or email already exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username is already taken."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})

        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']  # Assign role
        )
        user.set_password(validated_data['password'])
        user.save()

        # Automatically create a profile for the new user, using get_or_create
        Profile.objects.get_or_create(user=user)

        return user




from rest_framework import serializers
from .models import Appointment
from .models import User  # Make sure to import User if it's in a different file




""""

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='doctor'),
        write_only=True  # Allow writing the doctor's ID but not reading it
    )
    patient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='patient'),
        write_only=True  # Allow writing the patient's ID but not reading it
    )
    
    # You can still include the UserSerializer for reading if needed
    doctor_details = UserSerializer(source='doctor', read_only=True)
    patient_details = UserSerializer(source='patient', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'patient', 'appointment_date', 'reason', 'status', 'created_at', 'updated_at', 'doctor_details', 'patient_details']

"""

"""
class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.DOCTOR), required=True
    )
    patient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.PATIENT), required=False
    )

    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, attrs):
        doctor = attrs.get('doctor')
        patient = attrs.get('patient')

        # Ensure the doctor is not the patient
        if doctor == patient:
            raise serializers.ValidationError("Doctor and patient cannot be the same person.")

        return attrs

    def create(self, validated_data):
        # Automatically set the patient field if the user is a patient
        request = self.context.get('request')
        if request and request.user.role == User.PATIENT:
            validated_data['patient'] = request.user
        
        return super().create(validated_data)

"""


from rest_framework import serializers
from .models import Appointment
  # Assuming you have a UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    # Read-only for retrieving detailed doctor and patient data
    doctor_detail = UserSerializer(source='doctor', read_only=True)
    patient_detail = UserSerializer(source='patient', read_only=True)

    # In the AppointmentCreateView, either the doctor or patient field is dynamically overridden based on the logged-in user.
    # As a result, when the handleSubmit function is executed after clicking the "Book an Appointment" button:
    # - No doctor ID is passed when a doctor is booking an appointment.
    # - No patient ID is passed when a patient is booking an appointment.
    # This logic is managed in the backend, eliminating the need for frontend handling of these fields.
    
    doctor = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.DOCTOR), required=False)
    patient = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.PATIENT), required=False)

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'patient', 'doctor_detail', 'patient_detail', 'appointment_date', 'reason', 'status']
    
    def validate(self, attrs):
        doctor = attrs.get('doctor')
        patient = attrs.get('patient')

        # Ensure doctor is not the patient
        if doctor == patient:
            raise serializers.ValidationError("Doctor and patient cannot be the same person.")

        return attrs

    def create(self, validated_data):
        # Automatically assign the logged-in patient if they are creating the appointment
        request = self.context.get('request')
        if request and request.user.role == User.PATIENT:
            validated_data['patient'] = request.user
        

        return super().create(validated_data)
