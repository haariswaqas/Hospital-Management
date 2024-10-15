import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UserProfilePage = () => {
  const { authState } = useAuth(); // Access authentication state
  const [profile, setProfile] = useState(null); // To store profile data from the Profile model
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Use token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data); // Set the profile data from the Profile model
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch the profile only if the user is authenticated
    if (authState.isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.token]);

  const handleEditProfile = () => {
    navigate('/edit-profile/'); // Navigate to the UserProfileForm component
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    <h2 className="font-bold text-3xl justify-center text-center mb-12">
      My <span className="bg-[#f84525] text-white px-2 rounded-md">Profile</span>
    </h2>
  
    {/* User model data */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
     
      <p className="text-lg">
        <span className="font-semibold">Full Name: </span>
        {profile.first_name || 'N/A'}{' '}
        {profile.middle_name ? `${profile.middle_name} ` : ''} 
        {profile.last_name || 'N/A'}
      </p>
      
        <p className="text-lg">
          <span className="font-semibold">Username:</span> <span className="text-gray-700">{authState.user?.username}</span>
        </p>
        <p className="text-lg">
          <span className="font-semibold">Email:</span> <span className="text-gray-700">{authState.user?.email}</span>
        </p>
      </div>
  
      {/* Profile model data */}
      
    </div>
  
    {/* Conditionally render profile info based on user role */}
    {authState.user?.role === 'patient' && (
      <div className="mt-8 space-y-4">
        <p className="text-lg"><span className="font-semibold">Gender:</span> <span className="text-gray-700">{profile.gender}</span></p>
        <p className="text-lg"><span className="font-semibold">Phone Number:</span> <span className="text-gray-700">{profile.phone_number}</span></p>
        <p className="text-lg"><span className="font-semibold">Address:</span> <span className="text-gray-700">{profile.address}</span></p>
        <p className="text-lg"><span className="font-semibold">Age:</span> <span className="text-gray-700">{profile.age}</span></p>
        <p className="text-lg"><span className="font-semibold">Date of Birth:</span> <span className="text-gray-700">{profile.date_of_birth}</span></p>
        <p className="text-lg"><span className="font-semibold">Medical History:</span> <span className="text-gray-700">{profile.medical_history}</span></p>
      </div>
    )}
  
    {authState.user?.role === 'doctor' && (
      <div className="mt-8 space-y-4">
        <p className="text-lg"><span className="font-semibold">Specialization:</span> <span className="text-gray-700">{profile.specialization}</span></p>
        <p className="text-lg"><span className="font-semibold">Consultation Fees:</span> <span className="text-gray-700">{profile.consultation_fees}</span></p>
        <p className="text-lg"><span className="font-semibold">License Number:</span> <span className="text-gray-700">{profile.license_number}</span></p>
      </div>
    )}
  
    {authState.user?.role === 'admin' && (
      <div className="mt-8 space-y-4">
        <p className="text-lg"><span className="font-semibold">Admin Privileges:</span> <span className="text-gray-700">Full access to the system</span></p>
      </div>
    )}
  
    {/* Edit Profile Button */}
    <div className="mt-12 flex justify-center">
      <button
        type="submit"
        className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
        onClick={handleEditProfile}
      >
        Edit Profile
      </button>
    </div>
  </div>
  

  );
};

export default UserProfilePage;
