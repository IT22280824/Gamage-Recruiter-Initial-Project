// src/pages/OAuthSuccessPage.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);
      alert('Google OAuth Login Success!');
      navigate('/dashboard');
    } else {
      alert('Login failed.');
      navigate('/login');
    }
  }, [location, navigate]);

  return <p>Processing Google Login...</p>;
}

export default OAuthSuccessPage;
