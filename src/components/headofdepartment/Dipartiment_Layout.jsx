/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function Dipartiment_Layout() {
  
  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 ml-16 md:ml-56'>
          <Header />
          <main className='p-4'>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dipartiment_Layout;
