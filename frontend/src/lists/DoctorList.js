import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DoctorList = () => {
  const { authState } = useAuth(); // Get authentication state
  const [doctors, setDoctors] = useState([]); // To store the list of doctors
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctors(data); // Set the doctors data
        } else {
          setError('Failed to fetch doctor list');
          console.error('Failed to fetch doctor list');
        }
      } catch (error) {
        setError('Error fetching doctors');
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch doctors for both admins and patients
    if (authState.isAuthenticated && (authState.user.role === 'admin' || authState.user.role === 'patient')) {
      fetchDoctors();
    } else {
      setLoading(false); // Stop loading if user is not allowed to view the doctor list
    }
  }, [authState.isAuthenticated, authState.user.role, authState.token]); // Dependencies for useEffect

  const handleDelete = async (doctorId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctor/${doctorId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          setDoctors(doctors.filter((doctor) => doctor.id !== doctorId)); // Remove deleted doctor from state
        } else {
          setError('Failed to delete doctor');
        }
      } catch (error) {
        setError('Error deleting doctor');
        console.error('Error deleting doctor:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading doctors...</div>; // Loading state
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>; // Display error if exists
  }

  // Group doctors by specialization
  const groupedDoctors = doctors.reduce((groups, doctor) => {
    const specialization = doctor.profile.specialization;
    if (!groups[specialization]) {
      groups[specialization] = [];
    }
    groups[specialization].push(doctor);
    return groups;
  }, {});

  return (
    <div className="min-h-screen flex flex-col items-center justify bg-white font-sans text-gray-900">
      <div className="w-full sm:max-w-4xl mt-6 px-6 py-16 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <h2 className="font-bold text-3xl justify-center text-center">
          Doctors <span className="bg-[#f84525] text-white px-2 rounded-md">List</span>
        </h2>

        {authState.isAuthenticated && (authState.user.role === 'admin' || authState.user.role === 'patient') ? (
          Object.keys(groupedDoctors).length > 0 ? (
            Object.keys(groupedDoctors).map((specialization) => (
              <div key={specialization}>
                <h3 className="text-xl font-semibold mt-6">{specialization.toUpperCase()} Department</h3>
                <ul className="space-y-4">
                  {groupedDoctors[specialization].map((doctor) => (
                    <li key={doctor.id} className="border-b border-gray-300 pb-4">
                      <Link
                        to={`/doctor/${doctor.id}`}
                        className="text-lg text-gray-800 hover:text-blue-600 transition duration-200"
                      >
                        Dr. {`${doctor.profile.first_name} ${doctor.profile.last_name}`}
                      </Link>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                      

                      {authState.user.role === 'admin' && (
                        <div className="mt-2 space-x-4">
                          <button
                            onClick={() => handleDelete(doctor.id)}
                            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No doctors found.</p>
          )
        ) : (
          <p>You cannot view doctors.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
