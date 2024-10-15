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

  return (
    <div>
      <h2>Doctor Profile</h2>
      <p><strong>Username:</strong> {doctorProfile.username}</p>
      <p><strong>Email:</strong> {doctorProfile.email}</p>
      <p><strong>Role:</strong> {doctorProfile.role}</p>
      <p><strong>First Name:</strong> {doctorProfile.profile?.first_name}</p>
      <p><strong>Last Name:</strong> {doctorProfile.profile?.last_name}</p>
      <p><strong>Phone Number:</strong> {doctorProfile.profile?.phone_number}</p>
      <p><strong>Specialization:</strong> {doctorProfile.profile?.specialization}</p>

      {/* Only show the delete button if the logged-in user is an admin */}
      {authState.user.role === 'admin' && (
        <button onClick={handleDelete}>Delete Doctor Profile</button>
      )}
    </div>
  );
};

export default DoctorProfilePage;
