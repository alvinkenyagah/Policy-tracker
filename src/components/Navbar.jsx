import React from "react";
import swal from "sweetalert";

const Navbar = ({ onLogout }) => {
  const handleLogout = () => {
    swal({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("token"); // Remove the token from localStorage
        onLogout(); // Notify the App component about the logout
        swal("Logged out successfully!", {
          icon: "success",
        });
      } else {
        swal("You are still logged in!");
      }
    });
  };

  return (
    <>
      <style>
        {`
             .navbar {
    
    background-color: rgba(70, 70, 70, 0.7); /* Navbar background color */
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
  
  .navbar h1 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  
  .navbar button {
    background-color: white;
    color: #007bff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .navbar button:hover {
    background-color: #cf0e0e;
    color: white;
  }
                `}
      </style>

      <nav className="navbar">
        <h1>Insurance App</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </>
  );
};

export default Navbar;
