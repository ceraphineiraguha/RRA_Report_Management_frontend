import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit input to 5 characters
    if (/^\d{0,5}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Username:', username);
    console.log('OTP:', otp);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-xl font-semibold leading-9 tracking-tight text-gray-900">
          OTP numbers
        </h2>
      </div>
      <small className="mt-1.5 text-center">Enter the given OTP numbers to continue</small>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
              OTP
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                required
                maxLength="5"
                pattern="\d{5}"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;
