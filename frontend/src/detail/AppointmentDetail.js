import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext for auth state

const AppointmentDetail = () => {
  const { id } = useParams(); // Get the appointment ID from the URL parameters
  const { authState } = useAuth(); // Get authentication state
  const [appointment, setAppointment] = useState(null); // To store the appointment data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Pass token for authentication
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointment(data); // Set the appointment data
        } else {
          setError('Failed to fetch appointment details');
        }
      } catch (error) {
        setError('Error fetching appointment details');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch appointment details only if the user is authenticated
    if (authState.isAuthenticated) {
      fetchAppointmentDetail();
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [id, authState.isAuthenticated, authState.token, navigate]);

  if (loading) {
    return <div>Loading appointment details...</div>; // Loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Error message styled with red text
  }

  if (!appointment) {
    return <div>No appointment found.</div>; // No appointment message
  }

  return (
    <div className="container mx-auto max-w-4xl mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="font-bold text-3xl justify-center text-center mb-8">
        Appointment <span className="bg-[#f84525] text-white px-2 rounded-md">Details</span>
      </h2>

      <div className="space-y-4 text-lg">
        <p><span className="font-semibold">Patient:</span> {appointment.patient_detail?.profile?.first_name} {appointment.patient_detail?.profile?.last_name} ({appointment.patient_detail?.username})</p>
        <p><span className="font-semibold">Doctor:</span> {appointment.doctor_detail?.profile?.first_name} {appointment.doctor_detail?.profile?.last_name} ({appointment.doctor_detail?.username})</p>
        <p><span className="font-semibold">Date:</span> {new Date(appointment.appointment_date).toLocaleString()}</p>
        <p><span className="font-semibold">Status:</span> {appointment.status.toUpperCase()}</p>
        <p><span className="font-semibold">Reason:</span> {appointment.reason}</p>
      </div>

      {/* Conditionally render the Edit button if the appointment is not canceled */}
      {appointment.status !== 'canceled' && (
        <div className="mt-8 flex justify-center">
          <button
            className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
            onClick={() => navigate(`/edit-appointment/${id}`)}
          >
            Edit Appointment
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          className="inline-flex items-center px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150"
          onClick={() => navigate('/appointments')}
        >
          Back to Appointments
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetail;
