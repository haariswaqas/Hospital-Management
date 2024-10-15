import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PatientProfilePage = () => {
  const { authState } = useAuth(); // Get authentication state
  const { id } = useParams(); // Capture patient id from the URL params
  const navigate  = useNavigate();
  const [patientProfile, setPatientProfile] = useState(null); // To store patient profile data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatientProfile(data); // Set the fetched patient profile data
        } else {
          setError('Failed to fetch patient profile');
        }
      } catch (error) {
        setError('Error fetching patient profile');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch the profile only if user is authenticated
    if (authState.isAuthenticated) {
      fetchPatientProfile();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.token, id]); // Dependency array

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor profile?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          navigate('/patients'); // Redirect to the doctors list on successful delete
        } else {
          setError('Failed to delete patient profile');
        }
      } catch (error) {
        setError('Error deleting patient profile');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-600">{error}</div>;
  }

  if (!patientProfile) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">No profile found.</div>;
  }

  // Check if profile details are present
  const { profile } = patientProfile; // Destructure profile for easier access
  const handleAppointmentClick = () => {
    navigate(`/appointments/create/?patientId=${id}&patientName=${patientProfile.profile.first_name} ${patientProfile.profile.last_name}` );
  };
  return (
    <div className="container mx-auto max-w-5xl mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
  <h2 className="font-bold text-2xl justify-center text-center mb-12">
    Patient <span className="bg-[#f84525] text-white px-2 rounded-md">Profile</span>
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column - Basic Details */}
    <div className="space-y-4">
      <p>
        <span className="font-semibold">Full Name: </span>
        {profile?.first_name || 'N/A'}{' '}
        {profile?.middle_name ? `${profile.middle_name} ` : ''} 
        {profile?.last_name || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Gender:</span> {profile?.gender || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Age:</span> {profile?.age || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Date of Birth:</span> {profile?.date_of_birth || 'N/A'}
      </p>
    </div>

    {/* Right Column - Contact Info */}
    <div className="space-y-4">
      <p>
        <span className="font-semibold">Phone Number:</span> {profile?.phone_number || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Email Address:</span> {patientProfile.email}
      </p>
      <p>
        <span className="font-semibold">Address:</span> {profile?.address || 'N/A'}
      </p>
    </div>

    {/* Full Width - Medical History */}
    <div className="col-span-1 md:col-span-2">
      <p>
        <span className="font-semibold">Medical History:</span> {profile?.medical_history || 'N/A'}
      </p>
      <div className="mt-4">
        <button
            className="btn btn-primary"
            onClick={handleAppointmentClick}
        >
            Schedule Appointment for {profile?.first_name} {profile?.last_name}
        </button>
    </div>
    </div>
  </div>

  {/* Delete Button for Admins */}
  {authState.user.role === 'admin' && (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Patient Profile
      </button>
    </div>
  )}
</div>



  );
};

export default PatientProfilePage;
