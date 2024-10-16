# Hospital Management System

## Project Overview

The Hospital Management System (HMS) is a comprehensive web-based application designed to streamline hospital or clinic operations by enabling users to register as doctors or patients, book and manage appointments, and provide an efficient way for an admin to oversee users and their activities. The system offers a role-based user interface where:
- **Patients** can book appointments.
- **Doctors** can manage their schedules and appointments.
- **Admins** can manage both users and appointments, ensuring smooth operations across different user roles.

The HMS is powered by **Django** for the backend and **React** for the frontend. The architecture ensures real-time interactions between the frontend and backend, making the system responsive and user-friendly.

---

## Distinctiveness and Complexity

The Hospital Management System meets the distinctiveness and complexity requirements due to several reasons:

1. **Role-Based User Management**: The system handles three different types of users: Admin, Doctor, and Patient. Each has unique functionalities and access levels. Admins oversee users and appointments, doctors manage their appointments, and patients can book appointments. Handling these different roles and permissions adds complexity to the system, particularly in the areas of authentication and access control.

2. **Appointment Management**: The system enables patients to book appointments with doctors and allows doctors to view and manage their schedules. It ensures that no appointment overlaps occur, adding a layer of complexity to the business logic and database structure.

3. **Frontend-Backend Integration**: The integration between **React** and **Django** ensures a smooth flow of data between the frontend and backend, especially for appointment booking and management. The use of APIs to communicate between these two components adds to the project's complexity.

4. **Mobile Responsiveness**: Using CSS media queries and Bootstrap, the HMS adapts to different screen sizes, ensuring a seamless experience across mobile, tablet, and desktop devices. This aspect of design increases the complexity of the frontend.

5. **Healthcare Domain Specificity**: Unlike traditional e-commerce or social media applications, this project is tailored for the healthcare domain, offering distinct functionalities like role-based access, appointment management, and user-specific interactions that were not present in previous projects.

---

## Backend (Django API)

### Models (models.py)

1. **User Model**: The `User` model extends Django's `AbstractUser`, introducing user roles such as Admin, Patient, and Doctor. These roles dictate the user's access level and privileges within the system.
   - **Key Features**:
     - Custom roles for different user types.
     - Unique username and email for identification.

2. **Profile Model**: The `Profile` model stores additional information for each user. It distinguishes between patients and doctors through role-specific fields:
   - **Patients**: Record of medical history.
   - **Doctors**: Information on specialization, consultation fees, and license numbers.
   - The model also automatically calculates the user's age based on their date of birth.
   - **Key Features**:
     - Differentiation between patient and doctor profiles.
     - Automated age calculation from the date of birth.

3. **Appointment Model**: This model manages appointments between doctors and patients. It tracks details like the patient, doctor, date, reason, and status (Pending, Confirmed, Canceled). 
   - **Key Features**:
     - Relationship mapping between patients and doctors.
     - Automatic record-keeping of appointment creation and updates.

---

### Views (views.py)

#### Token, Registration, and Profile Management

1. **MyTokenObtainPairView**: A custom view for obtaining JWT tokens. It handles user authentication and generates a token for the user.
   
2. **RegisterView**: This view allows users to register. The `perform_create` method ensures that new users are assigned the default role of 'Patient' if none is provided.

3. **ProfileView**: Enables users to retrieve or update their profile. Role-based access control ensures that Admins can view all profiles, but Doctors and Patients can only view or update their own.

#### Patient Views

4. **PatientListView**: Provides a list of all patients, restricted to authenticated Doctors and Admins.

5. **PatientDetailView**: Allows viewing, updating, or deleting a specific patient's profile, ensuring proper permission checks are in place.

#### Doctor Views

6. **DoctorListView**: Similar to `PatientListView`, this view is restricted to Admin users who can view a list of doctors.

7. **DoctorDetailView**: Allows Admin users to manage a specific doctor's profile, ensuring appropriate permission checks.

#### Appointment Views

8. **AppointmentCreateView**: Allows authenticated users to create new appointments. It checks for appointment conflicts to avoid schedule overlaps and sets relationships between patients and doctors.

9. **AppointmentListView**: Lists all appointments for the logged-in user. Admins see all appointments, while Doctors and Patients only see their own.

10. **AppointmentDetailView**: Enables users to retrieve, update, or delete a specific appointment, with permission checks based on the user’s role.

---

### API Endpoints

- **Token Endpoints**:
  - `token/`: For obtaining a JWT when users log in.
  - `token/refresh/`: For refreshing access tokens.

- **Registration Endpoint**:
  - `register/`: Allows new users to register and create an account.

- **Profile Endpoints**:
  - `profile/`: Allows users to view or update their profiles.
  - `profile/<int:pk>/`: Enables Admins or authorized users to manage specific profiles.

- **Appointment Endpoints**:
  - `appointments/`: Displays a list of appointments for the logged-in user.
  - `appointments/create/`: Enables users to create new appointments.
  - `appointments/<int:pk>/`: Handles retrieval, update, or deletion of a specific appointment.

- **Patient List Endpoints**:
  - `patients/`: Accessible only to doctors to view patient lists.
  - `patient/<int:pk>/`: Allows doctors to retrieve or update a specific patient's details.

- **Doctor List Endpoints**:
  - `doctors/`: Displays all doctors, viewable only by admins.
  - `doctor/<int:pk>/`: Allows admins to manage a specific doctor’s details.

---

## Frontend (React)

### Folder Structure and Components

The frontend follows a modular structure, divided into folders with specific purposes:

1. **context**
   - **AuthContext.js**: Handles token authentication and provides login, logout, and registration functions across the app.

2. **navbar**
   - **NavBar.js**: The main navigation bar, appearing on all pages, shows different options based on the user's authentication status.

3. **register**
   - **Register.js**: Allows users to create a new account using functions from `AuthContext.js`.

4. **login**
   - **Login.js**: Handles user login with authentication logic from `AuthContext.js`.

5. **lists**
   - **AppointmentList.js**: Displays appointments for the logged-in user, tailored to their role (Doctor, Patient, Admin).
   - **PatientList.js**: Displays all patients, accessible only to Admin users.
   - **DoctorList.js**: Shows all doctors, accessible to both Patients and Admins.

6. **forms**
   - **AppointmentForm.js**: Allows doctors to manage appointments (reschedule, confirm, or cancel) and provides a form for patients to book appointments.
   - **UserProfileForm.js**: Allows users to update their profiles (excluding username and email).

7. **home**
   - **Homepage.js**: The landing page for logged-in users, presenting a dashboard with quick access to appointments and other features.

8. **route**
   - **RestrictedRoute.js**: Prevents logged-in users from accessing the registration and login pages.
   - **PrivateRoute.js**: Restricts access to authenticated users only for protected pages.

9. **App.js**: The main file where routes are defined, importing necessary components like `NavBar` and managing navigation.

---

## Conclusion

The Hospital Management System effectively combines the complexities of role-based user management, appointment scheduling, and responsive design into a cohesive application. With its integration of Django for the backend and React for the frontend, the HMS provides a smooth, dynamic user experience. The system is well-suited for hospitals or clinics looking for a comprehensive solution to manage patients, doctors, and appointments.
