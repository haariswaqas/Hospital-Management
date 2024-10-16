import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { authState, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav className="bg-[#f8f4f3] shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        {/* Logo and Site Name */}
        <div className="flex items-center">
          <img
            src="https://img.freepik.com/premium-vector/hospital-logo-vector_1277164-14288.jpg"
            alt="Hospital Logo"
            className="h-10 w-10"
          />
          <span className="text-3xl font-bold text-gray-800 ml-2">
      HealthHub MD
          </span>
        </div>
        
        {/* Hamburger Menu for Mobile View */}
        <button
          type="button"
          className="block md:hidden focus:outline-none"
          onClick={() => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
          }}
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex md:items-center">
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-gray-700 hover:text-blue-500 font-semibold"
              >
                Home
              </a>
            </li>
            {!authState.isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-blue-500 font-semibold"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-gray-700 hover:text-blue-500 font-semibold"
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="text-gray-700 font-semibold">
                    Welcome, {authState.user?.username}!
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-gray-700 hover:text-blue-500 font-semibold"
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/appointments/create')}
                    className="text-gray-700 hover:text-blue-500 font-semibold"
                  >
                    Book Appointment
                  </button>
                </li>
                {(authState.user.role === 'patient' || authState.user.role === 'doctor') && (
                  <li>
                    <button
                      onClick={() => navigate('/appointments')}
                      className="text-gray-700 hover:text-blue-500 font-semibold"
                    >
                      My Appointments
                    </button>
                  </li>
                )}
                {(authState.user.role === 'doctor' || authState.user.role === 'admin') && (
                  <li>
                    <button
                      onClick={() => navigate('/patients')}
                      className="text-gray-700 hover:text-blue-500 font-semibold"
                    >
                      View All Patients
                    </button>
                  </li>
                )}
                {(authState.user.role === 'patient' || authState.user.role === 'admin') && (
                  <li>
                    <button
                      onClick={() => navigate('/doctors')}
                      className="text-gray-700 hover:text-blue-500 font-semibold"
                    >
                      View All Doctors
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden w-full md:hidden">
          <ul className="flex flex-col space-y-2 mt-3">
            <li>
              <a href="/" className="text-gray-700 hover:text-blue-500">
                Home
              </a>
            </li>
            {!authState.isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="text-gray-700">
                    Welcome, {authState.user?.username}!
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/appointments/create')}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Book Appointment
                  </button>
                </li>
                {(authState.user.role === 'patient' || authState.user.role === 'doctor') && (
                  <li>
                    <button
                      onClick={() => navigate('/appointments')}
                      className="text-gray-700 hover:text-blue-500"
                    >
                      My Appointments
                    </button>
                  </li>
                )}
                {(authState.user.role === 'doctor' || authState.user.role === 'admin') && (
                  <li>
                    <button
                      onClick={() => navigate('/patients')}
                      className="text-gray-700 hover:text-blue-500"
                    >
                      View All Patients
                    </button>
                  </li>
                )}
                {(authState.user.role === 'patient' || authState.user.role === 'admin') && (
                  <li>
                    <button
                      onClick={() => navigate('/doctors')}
                      className="text-gray-700 hover:text-blue-500"
                    >
                      View All Doctors
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
