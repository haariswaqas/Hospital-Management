import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext for auth state
import { useNavigate } from 'react-router-dom';

const AppointmentList = () => {
  const { authState } = useAuth(); // Get authentication state
  const [appointments, setAppointments] = useState([]); // To store appointment data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/appointments/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Pass token for authentication
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data); // Set the appointments data
        } else {
          setError('Failed to fetch appointments');
        }
      } catch (error) {
        setError('Error fetching appointments');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch appointments only if the user is authenticated
    if (authState.isAuthenticated) {
      fetchAppointments();
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [authState.isAuthenticated, authState.token, navigate]);

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Pass token for authentication
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Filter out the deleted appointment from the state
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment.id !== appointmentId)
          );
        } else {
          setError('Failed to delete appointment');
        }
      } catch (error) {
        setError('Error deleting appointment');
      }
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>; // Loading state
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>; // Error message
  }

  if (appointments.length === 0) {
    return <div>No appointments found.</div>; // No appointments message
  }

  return (
    <div className="container mx-auto max-w-4xl mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    {authState.user.role === 'patient' || authState.user.role === 'doctor' ? (
      <h2 className="font-bold text-3xl justify-center text-center mb-4">
        My <span className="bg-[#f84525] text-white px-2 rounded-md">Appointments</span>
      </h2>
    ) : authState.user.role === 'admin' ? (
      <h2 className="font-bold text-3xl justify-center text-center mb-4">
        All <span className="bg-[#f84525] text-white px-2 rounded-md">Appointments</span>
      </h2>
    ) : null}

    {/* Sort appointments by 'updated_at' in descending order */}
    <ul className="space-y-4">
      {appointments
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sorting logic
        .map((appointment) => {
          let appointmentInfo = '';
          if (authState.user.role === 'patient') {
            appointmentInfo = `${appointment.status.toUpperCase()} appointment with Dr. ${appointment.doctor_detail?.profile?.first_name} ${appointment.doctor_detail?.profile?.last_name} on ${new Date(appointment.appointment_date).toLocaleString()}`;
          } else if (authState.user.role === 'doctor') {
            appointmentInfo = `${appointment.status.toUpperCase()} appointment with Patient ${appointment.patient_detail?.profile?.first_name} ${appointment.patient_detail?.profile?.last_name} on ${new Date(appointment.appointment_date).toLocaleString()}`;
          } else if (authState.user.role === 'admin') {
            appointmentInfo = `${appointment.patient_detail?.profile?.first_name} ${appointment.patient_detail?.profile?.last_name} - ${appointment.status} appointment with Dr. ${appointment.doctor_detail?.profile?.first_name} ${appointment.doctor_detail?.profile?.last_name} on ${new Date(appointment.appointment_date).toLocaleString()}`;
          }

          return (
            <li key={appointment.id} className="border-b border-gray-300 pb-4 flex justify-between items-center">
              {/* Link to the AppointmentDetail component */}
              <a 
                href={`/appointment/${appointment.id}`} 
                className={`text-lg font-semibold transition duration-200 ${
                  appointment.status === 'confirmed' ? 'text-green-600' : 
                  appointment.status === 'canceled' ? 'text-red-600' : 
                  'text-gray-600'
                } hover:text-blue-600`}
              >
                {appointmentInfo}
              </a>

              {/* Delete Appointment button, visible only for canceled appointments and admin role */}
              {authState.user.role === 'admin' && appointment.status === 'canceled' && (
                <button 
                  onClick={() => deleteAppointment(appointment.id)} 
                  className="ml-4 px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
    </ul>
</div>

  );
};

export default AppointmentList;
