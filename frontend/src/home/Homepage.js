import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppointmentList from '../lists/AppointmentList';

const Homepage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();



  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans text-gray-900">
  <div className="w-full max-w-7xl h-max px-16 py-6 bg-white shadow-lg rounded-lg text-center">

    <h1 className="font-bold text-4xl mb-1">Welcome to HealthHub MD!</h1>
      {/* AppointmentList in its own styled container */}
      
          <div className="bg-white p-8 rounded-lg ">
          
            <AppointmentList />
          </div>
        
    {!authState.isAuthenticated ? (
      <div className="flex justify-center space-x-6 mt-60">
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 bg-[#f84525] text-white font-semibold uppercase rounded-md hover:bg-red-800 transition ease-in-out duration-150"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-5 py-2 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
        >
          Register
        </button>
      </div>
    ) : (
      <div className="mt-12">
        <h2 className="text-2xl mb-4"> User <strong>{authState.user?.username?.toUpperCase()}</strong> logged in as: <strong>{authState.user?.role?.toUpperCase()}</strong> </h2>
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
    
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate('/appointments/create')}
            className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
          >
            Book an Appointment
          </button>
          {(authState.user.role === 'doctor' || authState.user.role === 'admin') && (
            <button
              onClick={() => navigate('/appointments')}
              className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
            >
              Manage Appointments
            </button>
          )}
          {(authState.user.role === 'patient' || authState.user.role === 'doctor') && (
            <button
              onClick={() => navigate('/appointments')}
              className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
            >
              My Appointments
            </button>
          )}
          {(authState.user.role === 'doctor' || authState.user.role === 'admin') && (
            <button
              onClick={() => navigate('/patients')}
              className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
            >
              View All Patients
            </button>
          )}
          {(authState.user.role === 'patient' || authState.user.role === 'admin') && (
            <button
              onClick={() => navigate('/doctors')}
              className="px-6 py-3 bg-white text-[#f84525] border-2 border-[#f84525] font-semibold uppercase rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
            >
              View All Doctors
            </button>
          )}
        </div>

      
      </div>
    )}
  </div>
</div>


  );
};

export default Homepage;
