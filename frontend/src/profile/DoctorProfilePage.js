import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorProfilePage = () => {
  const { authState } = useAuth(); // Get authentication state
  const { id } = useParams(); // Capture doctor id from the URL params
  const [doctorProfile, setDoctorProfile] = useState(null); // To store doctor profile data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate(); // Use navigate for redirecting

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctor/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctorProfile(data); // Set the fetched doctor profile data
        } else {
          setError('Failed to fetch doctor profile');
        }
      } catch (error) {
        setError('Error fetching doctor profile');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch the profile only if the user is authenticated
    if (authState.isAuthenticated) {
      fetchDoctorProfile();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.token, id]); // Dependency array

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor profile?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctor/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authorization
          },
        });

        if (response.ok) {
          navigate('/doctors'); // Redirect to the doctors list on successful delete
        } else {
          setError('Failed to delete doctor profile');
        }
      } catch (error) {
        setError('Error deleting doctor profile');
      }
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctorProfile) {
    return <div>No profile found.</div>;
  }
  const handleAppointmentClick = () => {
    navigate(`/appointments/create/?doctorId=${id}&doctorName=Dr.${doctorProfile.profile.first_name} ${doctorProfile.profile.last_name} (${doctorProfile.profile.specialization})` );
  };

  return (
    <div className="container mx-auto max-w-5xl mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    <h2 className="font-bold text-2xl justify-center text-center mb-12">
                    Doctor <span className="bg-[#f84525] text-white px-2 rounded-md">Profile</span>
                </h2>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Basic Details */}
      <div className="space-y-4">
     
        <p>
        <span className="font-semibold">Full Name: </span>
        {doctorProfile.profile?.first_name || 'N/A'}{' '}
        {doctorProfile.profile?.middle_name ? `${doctorProfile.profile?.middle_name} ` : ''} 
        {doctorProfile.profile?.last_name || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Gender:</span> {doctorProfile.profile?.gender || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Age:</span> {doctorProfile.profile?.age || 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Date of Birth:</span> {doctorProfile.profile?.date_of_birth || 'N/A'}
      </p>
      </div>
  
      {/* Right Column - Contact Info */}
      <div className="space-y-4">
        <p>
          <span className="font-semibold">Email: </span> {doctorProfile.email || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Phone Number: </span> {doctorProfile.profile?.phone_number || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Specialization: </span> {doctorProfile.profile?.specialization || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Consultation Fees: </span> GHc{doctorProfile.profile?.consultation_fees || 'N/A'}
        </p>
        <div className="mr-10 flex justify">
  <button
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    onClick={handleAppointmentClick}
  >
    Book Appointment
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
          Delete Doctor Profile
        </button>
      </div>
    )}
  </div>
  
  );
};

export default DoctorProfilePage;
