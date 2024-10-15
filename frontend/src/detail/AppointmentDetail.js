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
    return <div style={{ color: 'red' }}>{error}</div>; // Error message
  }

  if (!appointment) {
    return <div>No appointment found.</div>; // No appointment message
  }

  return (
    <div>
      <h2>Appointment Details</h2>
      <p><strong>Patient:</strong> {appointment.patient_detail?.profile?.first_name} {appointment.patient_detail?.profile?.last_name} ({appointment.patient_detail?.username})</p>
      <p><strong>Doctor:</strong> {appointment.doctor_detail?.profile?.first_name} {appointment.doctor_detail?.profile?.last_name} ({appointment.doctor_detail?.username})</p>
      <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
      <p><strong>Status:</strong> {appointment.status}</p>
      <p><strong>Reason:</strong> {appointment.reason}</p>
      {/* Add any additional appointment details you want to show */}
      
      {/* Conditionally render the Edit button if the appointment is not canceled */}
      {appointment.status !== 'canceled' && (
        <button onClick={() => navigate(`/edit-appointment/${id}`)}>Edit Appointment</button>
      )}
      
      <button onClick={() => navigate('/appointments')}>Back to Appointments</button>
    </div>
  );
};

export default AppointmentDetail;
