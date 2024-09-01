// // LoginComponent.jsx
// import React, { useState } from 'react';

// const LoginComponent = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

// //   const handleLogin = async () => {
// //     try {
// //       const response = await fetch('http://localhost:3000/api/auth/login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ username, password }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Login failed');
// //       }

// //       const data = await response.json();
// //       localStorage.setItem('token', data.token);
// //       onLoginSuccess(); // Notify App component about successful login
// //     } catch (error) {
// //       console.error('Login failed:', error);
// //     }
// //   };

// const handleLogin = async () => {
//     try {
//       const response = await fetch('https://insurance-nodejs-server.onrender.com/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Invalid username or password');
//       }

//       const data = await response.json();
//       localStorage.setItem('token', data.token);
//       onLoginSuccess(); // Notify App component about successful login
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div>
//         <div>
//             <style>
//                {
//                 `
//                 /* Global Styles */
// body {
//   font-family: Arial, sans-serif;
//   background-color: #f0f2f5;
//   margin: 0;
//   padding: 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// }

// .container {
//   background-color: #fff;
//   padding: 2rem;
//   border-radius: 8px;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   width: 300px;
// }

// h2 {
//   text-align: center;
//   margin-bottom: 1.5rem;
//   color: #333;
// }

// input[type="text"],
// input[type="password"] {
//   width: 100%;
//   padding: 10px;
//   margin-bottom: 1rem;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 14px;
// }

// input[type="text"]:focus,
// input[type="password"]:focus {
//   border-color: #007bff;
//   outline: none;
//   box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
// }

// button {
//   width: 100%;
//   padding: 10px;
//   background-color: #007bff;
//   border: none;
//   border-radius: 4px;
//   color: white;
//   font-size: 16px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
// }

// button:hover {
//   background-color: #0056b3;
// }

// .error-message {
//   color: red;
//   margin-bottom: 1rem;
//   text-align: center;
//   font-size: 14px;
// }

//                 `
//                }
//             </style>
//         </div>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Username"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default LoginComponent;

import React, { useState } from "react";

const LoginComponent = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // TOGGLE PASSWORD VISIBILITY
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear previous error
    try {
      const response = await fetch(
        "https://insurance-nodejs-server.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      onLoginSuccess(); // Notify App component about successful login
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <style>
          {`
                /* Global Styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 14px;
}

                `}
        </style>
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={loading}
      />

      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Enter your password"
          style={{ paddingRight: "40px" }}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: "#007bff",
          }}
        >
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>

      <button onClick={handleLogin} disabled={loading} className="login-btn">
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default LoginComponent;
