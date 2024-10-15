import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PatientProfilePage = () => {
  const { authState } = useAuth(); // Get authentication state
  const { id } = useParams(); // Capture patient id from the URL params
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
          console.log('Fetched patient profile:', data); // Log the data for debugging
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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!patientProfile) {
    return <div>No profile found.</div>;
  }

  // Check if profile details are present
  const { profile } = patientProfile; // Destructure profile for easier access

  return (
    <div>
      <h2>Patient Profile</h2>
      <p><strong>Username:</strong> {patientProfile.username}</p>
      <p><strong>Email:</strong> {patientProfile.email}</p>
      <p><strong>Role:</strong> {patientProfile.role}</p>
      <p><strong>First Name:</strong> {profile?.first_name || 'N/A'}</p>
      <p><strong>Last Name:</strong> {profile?.last_name || 'N/A'}</p>
      <p><strong>Gender:</strong> {profile?.gender || 'N/A'}</p>
      <p><strong>Phone Number:</strong> {profile?.phone_number || 'N/A'}</p>
      <p><strong>Address:</strong> {profile?.address || 'N/A'}</p>
      <p><strong>Age:</strong> {profile?.age || 'N/A'}</p>
      <p><strong>Date of Birth:</strong> {profile?.date_of_birth || 'N/A'}</p>
      <p><strong>Medical History:</strong> {profile?.medical_history || 'N/A'}</p>
    </div>
  );
};

export default PatientProfilePage;
