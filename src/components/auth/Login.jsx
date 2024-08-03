/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import AboutImg from '../../assets/police_image/img2.jpeg';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error message

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('https://rra-report-management-system-backend.onrender.com/login/', {
      username: username,
      password: password
    })
      .then((res) => {
        if (res.data) {
          const user = {
            username: username,
            role: res.data.role,
            accessToken: res.data.access,
            refreshToken: res.data.refresh,
            id: res.data.id // Ensure `id` is included in the response
          };

          sessionStorage.setItem('userData', JSON.stringify(user));

          if (user.role === 'admin') {
            navigate('/admin');
          } else if (user.role === 'unit user') {
            navigate('/unityuser');
          } else if (user.role === 'head of department') {
            navigate('/departement');
          } else if (user.role === 'head of division') {
            navigate('/division');
          } else {
            console.log('Unknown user role. Please contact support.');
          }
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // Set the error message from the backend response
          setError(error.response.data.error || 'An error occurred. Please try again.');
        } else {
          setError('An error occurred. Please try again.');
        }
      });
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white">
      {/* Form section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-white w-full lg:w-1/2">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-center font-bold text-lg text-gray-900 block mb-4">Sign in to your account</h1>
          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/passwordreset" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-purple-400 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign In
              </button>
            </div>
          </form>
          {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign Up
            </Link>
          </p> */}
        </div>
        {/* Image section */}
        <div className="hidden lg:flex w-1/2 h-auto">
          <img src={AboutImg} alt="About" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;
