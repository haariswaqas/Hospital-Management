import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access);
        navigate('/');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify bg-white font-sans text-gray-900">
  <div className="w-full sm:max-w-md mt-20 px-6 py-16 bg-[#f8f4f3] shadow-md overflow-hidden sm:rounded-lg">
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center mb-4">
        <a href="/">
          <h2 className="font-bold text-3xl mb-6">
            Sign <span className="bg-[#f84525] text-white px-2 rounded-md">In</span>
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
        <div className="relative">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] focus:outline-none focus:ring-2 focus:ring-[#f84525] focus:border-transparent mt-5"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <label htmlFor="remember_me" className="flex items-center"></label>
      </div>

      <div className="flex items-center justify-end mt-6">
        <button
          type="submit"
          className="ml-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84525] transition ease-in-out duration-150"
        >
          Log In
        </button>
      </div>

      {/* Add "Don't have an account?" text and button */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <a href="/registration" className="text-[#f84525] hover:underline">
            Sign up here
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

export default Login;
