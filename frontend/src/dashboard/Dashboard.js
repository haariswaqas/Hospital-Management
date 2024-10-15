import React from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is in ../context
import PatientList from '../lists/PatientList'; // Adjust path as needed
import DoctorList from '../lists/DoctorList'; // Adjust path as needed
import AppointmentList from '../lists/AppointmentList'; // Adjust path as needed

const Dashboard = () => {
  const { authState } = useAuth();

  // Ensure user is logged in
  if (!authState.isAuthenticated) {
    return <div className="text-center text-red-500 mt-10">Please log in to access the dashboard.</div>;
  }

  const role = authState.user.role; // Assuming 'role' is stored in user object

  return (
    <div className="dashboard-container bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Show different components based on the user's role */}
        {role === 'admin' && (
          <>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients</h2>
              <PatientList />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctors</h2>
              <DoctorList />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointments</h2>
              <AppointmentList />
            </div>
          </>
        )}

        {role === 'patient' && (
          <>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctors</h2>
              <DoctorList />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointments</h2>
              <AppointmentList />
            </div>
          </>
        )}

        {role === 'doctor' && (
          <>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients</h2>
              <PatientList />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointments</h2>
              <AppointmentList />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
