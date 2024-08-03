/* eslint-disable no-unused-vars */
// src/components/ProtectedRoute.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userData = sessionStorage.getItem('userData');
  const isAuthenticated = userData !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
