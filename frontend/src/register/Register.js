import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,
                password,
                password2,
                role
            });
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify bg-white font-sans text-gray-900">
            <div className="w-full sm:max-w-md mt-10 px-6 py-16 bg-[#f8f4f3] shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-6">
                        <a href="/">
                            <h2 className="font-bold text-3xl">
                                Sign <span className="bg-[#f84525] text-white px-2 rounded-md">Up</span>
                            </h2>
                        </a>
                    </div>
                    

                    <div className="mt-4">
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-2"
                            required
                        />
                    </div>
                    

                    <div className="mt-4">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-2" 
                            required
                        />
                    </div>
                    

                    <div className="mt-4">
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-2"
                            required
                        />
                    </div>
                    

                    <div className="mt-4">
                        <input
                            id="password2"
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-2"
                            required
                        />
                    </div>
                    

                    <div className="mt-4">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-2"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    

                    <div className="flex items-center justify-end mt-6">
                        <button
                            type="submit"
                            className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
                        >
                            Register
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    {/* Add "Don't have an account?" text and button */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-[#f84525] hover:underline">
            Sign In here
          </a>
        </p>
      </div>

      {/* Back to homepage button */}
      <div className="mt-4 text-center">
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition ease-in-out duration-150"
        >
          Back to Homepage
        </a>
      </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
