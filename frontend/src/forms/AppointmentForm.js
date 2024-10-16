import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const AppointmentForm = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the appointment ID from the URL 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  const doctorId = queryParams.get('doctorId'); // Get studentId from query params
 
  const [patients, setPatients] = useState([]); // Store patients for admin and doctors
  const [doctors, setDoctors] = useState([]); // Store doctors for admin and patients
  const [appointmentDate, setAppointmentDate] = useState(''); // Store appointment date
  const [selectedDoctor, setSelectedDoctor] = useState(authState.user.role === 'doctor' ? authState.user.id : ''); // Pre-fill doctor if role is doctor
  const [selectedPatient, setSelectedPatient] = useState(authState.user.role === 'patient' ? authState.user.id : ''); // Pre-fill patient if role is patient
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default status
  const [reason, setReason] = useState(''); // Store reason for appointment
  const [error, setError] = useState(null);
 // Prefill the patient field without making it read-only
 useEffect(() => {
  if (patientId) {
    setSelectedPatient(patientId); // Prefill patient, but it remains editable
  }
}, [patientId]);

 // Prefill the patient field without making it read-only
 useEffect(() => {
  if (doctorId) {
    setSelectedDoctor(doctorId); // Prefill patient, but it remains editable
  }
}, [doctorId]);

  // Helper function to retrieve CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (error) {
        setError('Error fetching doctors');
      }
    };

    const fetchPatients = async () => {
      if (authState.user.role === 'admin' || authState.user.role === 'doctor') {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/patients/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authState.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPatients(data);
          } else {
            setError('Failed to fetch patients');
          }
        } catch (error) {
          setError('Error fetching patients');
        }
      }
    };

    const fetchAppointmentDetails = async () => {
      if (id) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authState.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const appointment = await response.json();

            // Ensure the date is properly formatted for the input type="datetime-local"
            const formattedDate = new Date(appointment.appointment_date).toISOString().slice(0, 16);
            
            setAppointmentDate(formattedDate);
            setSelectedDoctor(appointment.doctor);
            setSelectedPatient(appointment.patient);
            setSelectedStatus(appointment.status);
            setReason(appointment.reason);
          } else {
            setError('Failed to fetch appointment details');
          }
        } catch (error) {
          setError('Error fetching appointment details');
        }
      }
    };

    fetchDoctors();
    fetchPatients();
    fetchAppointmentDetails(); // Fetch details if editing an existing appointment
  }, [authState.token, authState.user.role, id]);

  const createOrUpdateAppointment = async (e) => {
    e.preventDefault();

    const doctorId = authState.user.role === 'doctor' ? authState.user.id : selectedDoctor; 
    const patientId = authState.user.role === 'patient' ? authState.user.id : selectedPatient; 

    const appointmentData = {
      patient: patientId,
      doctor: doctorId,
      appointment_date: appointmentDate,
      status: selectedStatus,
      reason: reason,
    };

    try {
      let response;
      if (id) {
        // If we are editing an existing appointment
        response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(appointmentData),
        });
      } else {
        // If we are creating a new appointment
        response = await fetch('http://127.0.0.1:8000/api/appointments/create/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(appointmentData),
        });
      }

      if (response.ok) {
        const message = id ? 'Appointment updated successfully!' : 'Appointment booked successfully!';
        alert(message);
        navigate('/appointments');
      } else {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        setError(errorResponse.detail || 'Error saving appointment');
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError('Error saving appointment');
    }
  };

  const cancelAppointment = async () => {
    setSelectedStatus('canceled');  

    const doctorId = authState.user.role === 'doctor' ? authState.user.id : selectedDoctor; 
    const patientId = authState.user.role === 'patient' ? authState.user.id : selectedPatient; 

    const appointmentData = {
      patient: patientId,
      doctor: doctorId,
      appointment_date: appointmentDate,
      status: 'canceled',
      reason: reason,
    };

    try {
      let response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert('Appointment canceled successfully!');
        navigate('/appointments');
      } else {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        setError(errorResponse.detail || 'Error canceling appointment');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError('Error canceling appointment');
    }
  };

  const confirmAppointment = async () => {
    setSelectedStatus('confirmed');  

    const doctorId = authState.user.role === 'doctor' ? authState.user.id : selectedDoctor; 
    const patientId = authState.user.role === 'patient' ? authState.user.id : selectedPatient; 

    const appointmentData = {
      patient: patientId,
      doctor: doctorId,
      appointment_date: appointmentDate,
      status: 'confirmed',
      reason: reason,
    };

    try {
      let response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert('Appointment confirmed successfully!');
        navigate('/appointments');
      } else {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        setError(errorResponse.detail || 'Error confirming appointment');
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setError('Error confirming appointment');
    }
  };

  // Rendering the form...
  return (
<div className="min-h-screen flex flex-col items-center justify bg-[#f8f4f3] font-sans text-gray-900">
    <div className="w-full sm:max-w-4xl mt-6 px-6 py-16 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <div>
            <h2 className="font-bold text-3xl justify-center text-center">
                Schedule <span className="bg-[#f84525] text-white px-2 rounded-md">Appointment</span>
            </h2>
        </div>
        <br />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={createOrUpdateAppointment}>
            {(authState.user.role === 'admin' || authState.user.role === 'patient') && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Doctor:</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                        disabled={id && authState.user.role === 'admin'}
                        className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                Dr. {doctor.profile?.last_name} ({doctor.profile?.specialization})
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {(authState.user.role === 'admin' || authState.user.role === 'doctor') && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Patient:</label>
                    <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        required
                        disabled={id && authState.user.role === 'admin'}
                        className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                    >
                        <option value="">Select a patient</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.profile?.first_name} {patient.profile?.last_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Schedule For:</label>
                <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                />
            </div>
            <div className="mt-4">
               
                <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">Status:</label>
    <select
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    disabled={authState.user.role === 'patient'}
    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
>
    {id || authState.user.role === 'doctor' ? (
      <>
      <option value="confirmed">Confirmed</option>
      
      
      
      </>
        
        
    ) : (
        <>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            
        </>
    )}
</select>

</div>

            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Reason:</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    disabled={id && authState.user.role === 'doctor'}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-1"
                    placeholder="Reason for appointment..."
                />
            </div>
            <div className="flex items-center justify-end mt-6">
            <button
    type="submit"
    className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
>
    {id
        ? authState.user.role === 'doctor'
            ? 'Reschedule Appointment'
            : 'Update Appointment'
        :
        
         'Book Appointment'}
</button>


                {id && (
                    <>
                        <button
                            type="button"
                            onClick={cancelAppointment}
                            className="ml-4 inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
                        >
                            Cancel Appointment
                        </button>
                        {authState.user.role !== 'patient' && (
                            <button
                                type="button"
                                onClick={confirmAppointment}
                                disabled={selectedStatus === 'confirmed'}
                                className={`ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest transition ease-in-out duration-150 ${
                                    selectedStatus === 'confirmed'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-800 focus:ring-[#f84525]'
                                }`}
                            >
                                Confirm Appointment
                            </button>
                        )}
                    </>
                )}
            </div>
        </form>
    </div>
</div>


  );
};

export default AppointmentForm;