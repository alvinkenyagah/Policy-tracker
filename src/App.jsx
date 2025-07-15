import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginComponent from './components/LoginComponent.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check if JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    } catch (error) {
      // If token can't be parsed, consider it expired
      return true;
    }
  };

  // Function to validate token with your backend
  const validateTokenWithServer = async (token) => {
    try {
      const response = await fetch('/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Function to handle logout and cleanup
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Function to check token validity on app initialization
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    // Check if token is expired (for JWT tokens)
    if (isTokenExpired(token)) {
      handleLogout();
      setIsLoading(false);
      return;
    }

    // Optional: Validate with server (recommended for production)
    // Uncomment these lines if you want server-side validation
    /*
    const isValid = await validateTokenWithServer(token);
    if (!isValid) {
      handleLogout();
      setIsLoading(false);
      return;
    }
    */

    setIsLoggedIn(true);
    setIsLoading(false);
  };

  // Set up token validation on app load
  useEffect(() => {
    checkTokenValidity();
  }, []);

  // Set up periodic token checking
  useEffect(() => {
    if (!isLoggedIn) return;

    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        handleLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  // Set up API response interceptor for automatic logout on 401
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // If any API call returns 401, automatically logout
      if (response.status === 401) {
        handleLogout();
      }
      
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  // Show loading while checking token validity
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Navbar onLogout={handleLogout} />
          <HomePage />
        </>
      ) : (
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;