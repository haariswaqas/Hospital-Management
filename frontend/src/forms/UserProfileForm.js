import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = () => {
  const { authState } = useAuth(); // Access authentication state
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    phone_number: '',
    address: '',
    age: '',
    date_of_birth: '',
    medical_history: '',
    specialization: '',
    consultation_fees: '',
    license_number: ''
  });
  const [loading, setLoading] = useState(true);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`, // Use token for authentication
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        // Handle successful update (e.g., show a success message)
        console.log('Profile updated successfully');
        navigate('/profile')
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify bg-[#f8f4f3] font-sans text-gray-900">
    <div className="w-full sm:max-w-6xl mt-6 px-6 py-16 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <h2 className="font-bold text-3xl justify-center text-center mb-4">
            Edit <span className="bg-[#f84525] text-white px-2 rounded-md">Profile</span>
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User model data */}
            <div className="mt-4 col-span-1">
    <label className="block text-sm font-medium text-gray-700">Username:</label>
    <input
        type="text"
        value={authState.user?.username}
        readOnly
        className="w-full rounded-md py-2.5 px-4 border text-sm bg-gray-200 cursor-not-allowed outline-none"
    />
</div>
<div className="mt-4 col-span-1">
    <label className="block text-sm font-medium text-gray-700">Email:</label>
    <input
        type="email"
        value={authState.user?.email}
        readOnly
        className="w-full rounded-md py-2.5 px-4 border text-sm bg-gray-200 cursor-not-allowed outline-none"
    />
</div>

            {/* Profile model fields */}
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Middle Name:</label>
                <input
                    type="text"
                    name="middle_name"
                    value={profile.middle_name}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Gender:</label>
                <input
                    type="text"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                    type="text"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Address:</label>
                <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Age:</label>
                <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                    readOnly
                />
            </div>
            <div className="mt-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>

            {/* Conditional fields based on role */}
            {authState.user?.role === 'patient' && (
                <div className="mt-4 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Medical History:</label>
                    <textarea
                        name="medical_history"
                        value={profile.medical_history}
                        onChange={handleChange}
                        className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                    />
                </div>
            )}
            {authState.user?.role === 'doctor' && (
                <>
                    <div className="mt-4 col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Specialization:</label>
                        <input
                            type="text"
                            name="specialization"
                            value={profile.specialization}
                            onChange={handleChange}
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                        />
                    </div>
                    <div className="mt-4 col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Consultation Fees:</label>
                        <input
                            type="number"
                            name="consultation_fees"
                            value={profile.consultation_fees}
                            onChange={handleChange}
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                        />
                    </div>
                    <div className="mt-4 col-span-1">
                        <label className="block text-sm font-medium text-gray-700">License Number:</label>
                        <input
                            type="text"
                            name="license_number"
                            value={profile.license_number}
                            onChange={handleChange}
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                        />
                    </div>
                </>
            )}

            <div className="flex items-center justify-end mt-6 col-span-2">
                <button
                    type="submit"
                    className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
                >
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>

  );
};

export default UserProfileForm;
