import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const PatientList = () => {
  const { authState } = useAuth(); // Get authentication state
  const [patients, setPatients] = useState([]); // To store the patient list data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors
 
  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient/${patientId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });
  
        if (response.ok) {
          setPatients(patients.filter((patient) => patient.id !== patientId)); // Remove deleted patient from state
        } else {
          setError('Failed to delete patient');
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
        setError('Error deleting patient');
      }
    }
  };
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/patients/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched patients:', data); // Log the data for debugging
          setPatients(data); // Set the fetched patient list data
        } else {
          setError('Failed to fetch patient list');
        }
      } catch (error) {
        setError('Error fetching patient list');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    

    // Fetch patients only if user is authenticated
    if (authState.isAuthenticated) {
      fetchPatients();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.token]); // Dependency array

  // Loading state
  if (loading) {
    return <div>Loading patients...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  // No patients found state
  if (patients.length === 0) {
    return <div>No patients found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify bg-white font-sans text-gray-900">
    <div className="w-full sm:max-w-4xl mt-6 px-6 py-16 bg-white shadow-md overflow-hidden sm:rounded-lg">
        
      <h2 className="font-bold text-3xl justify-center text-center">
                    Patients <span className="bg-[#f84525] text-white px-2 rounded-md">List</span>
                </h2>
        
        <ul className="space-y-4">
            {patients.map((patient) => (
                <li key={patient.id} className="border-b border-gray-300 pb-4">
                    <Link
                        to={`/patient/${patient.id}`}
                        className="text-lg text-gray-800 hover:text-blue-600 transition duration-200"
                    >
                        {`${patient.profile.first_name} ${patient.profile.last_name}`}
                    </Link>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    
                    {authState.user.role === 'admin' && (
                        <div className="mt-2 space-x-4">
                            <button
                                onClick={() => handleDelete(patient.id)}
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
</div>
  );
};

export default PatientList;





