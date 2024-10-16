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
import RestrictedRoute from './route/RestrictedRoute'; 
import PrivateRoute from './route/PrivateRoute';
import NavBar from './navbar/NavBar'; 

import './App.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* NavBar appears on all pages */}
                <NavBar />
                <Routes>
                    <Route element={<Homepage />} path="/" exact />
                    

                    {/* Apply RestrictedRoute to login and register pages */}
                    <Route path="/login" element={
                        <RestrictedRoute>
                            <Login />
                        </RestrictedRoute>
                    } exact />

                    <Route path="/registration" element={
                        <RestrictedRoute>
                            <Register />
                        </RestrictedRoute>
                    } exact />

                    {/* Apply PrivateRoute to all other routes */}
                    <Route path="/patients" element={
                        <PrivateRoute>
                            <PatientList />
                        </PrivateRoute>
                    } exact />

                    <Route path="/doctors" element={
                        <PrivateRoute>
                            <DoctorList />
                        </PrivateRoute>
                    } exact />

                    <Route path="/appointments" element={
                        <PrivateRoute>
                            <AppointmentList />
                        </PrivateRoute>
                    } exact />

                    <Route path="/profile" element={
                        <PrivateRoute>
                            <UserProfilePage />
                        </PrivateRoute>
                    } exact />

                    <Route path="/patient/:id" element={
                        <PrivateRoute>
                            <PatientProfilePage />
                        </PrivateRoute>
                    } exact />

                    <Route path="/edit-patient/:id" element={
                        <PrivateRoute>
                            <PatientProfilePage />
                        </PrivateRoute>
                    } exact />

                    <Route path="/doctor/:id" element={
                        <PrivateRoute>
                            <DoctorProfilePage />
                        </PrivateRoute>
                    } exact />

                    <Route path="/appointment/:id" element={
                        <PrivateRoute>
                            <AppointmentDetail />
                        </PrivateRoute>
                    } exact />

                    <Route path="/edit-appointment/:id" element={
                        <PrivateRoute>
                            <AppointmentForm />
                        </PrivateRoute>
                    } exact />

                    <Route path="/edit-profile" element={
                        <PrivateRoute>
                            <UserProfileForm />
                        </PrivateRoute>
                    } exact />

                    <Route path="/appointments/create" element={
                        <PrivateRoute>
                            <AppointmentForm />
                        </PrivateRoute>
                    } exact />
                </Routes>
                
               

                             
            </Router>
        </AuthProvider>
    );
};

export default App;
