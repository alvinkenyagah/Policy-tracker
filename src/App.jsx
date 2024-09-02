import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginComponent from './components/LoginComponent.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update the state to log out the user
  };

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
