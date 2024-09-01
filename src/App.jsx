import React, { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginComponent from './components/LoginComponent.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <HomePage />
      ) : (
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
