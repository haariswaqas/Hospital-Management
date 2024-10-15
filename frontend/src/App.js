import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import Homepage from './home/Homepage';
import PatientList from './lists/PatientList';
import DoctorList from './lists/DoctorList';
import AppointmentList from './lists/AppointmentList';
import UserProfilePage from './profile/UserProfilePage';
import PatientProfilePage from './profile/PatientProfilePage';
import DoctorProfilePage from './profile/DoctorProfilePage';
import AppointmentDetail from './detail/AppointmentDetail';
import AppointmentForm from './forms/AppointmentForm';
import UserProfileForm from './forms/UserProfileForm';
import { AuthProvider } from './context/AuthContext';
import RestrictedRoute from './route/RestrictedRoute'; // Import RestrictedRoute
import NavBar from './navbar/NavBar'; // Import NavBar
import './App.css'


const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* NavBar appears on all pages */}
                <NavBar />
                <Routes>
                    <Route element={<Homepage />} path="/" exact /> {/* Homepage route */}

                    {/* Apply RestrictedRoute to login and register pages */}
                    <Route path="/login" element={
                        <RestrictedRoute>
                            <Login />
                        </RestrictedRoute>
                    } exact />

                    <Route path="/register" element={
                        <RestrictedRoute>
                            <Register />
                        </RestrictedRoute>
                    } exact />

                    <Route element={<PatientList />} path="/patients" exact />
                    <Route element={<DoctorList />} path="/doctors" exact />
                    <Route element={<AppointmentList />} path="/appointments" exact />

                    <Route element={<UserProfilePage />} path="/profile" exact />
                    
                    <Route element={<PatientProfilePage />} path="/patient/:id" exact />
                    <Route element={<PatientProfilePage />} path="/edit-patient/:id" exact />
                    <Route element={<DoctorProfilePage />} path="/doctor/:id" exact />
                    <Route element={<AppointmentDetail />} path="/appointment/:id" exact />
                    <Route element={<AppointmentForm />} path="/edit-appointment/:id" exact />
                    <Route element={<UserProfileForm />} path="/edit-profile/" exact />

                    <Route element={<AppointmentForm />} path="/appointments/create" exact />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
