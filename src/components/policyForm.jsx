import React, { useState } from "react";
import swal from 'sweetalert';
const PolicyForm = ({ onPolicyAdded }) => {
  const [formData, setFormData] = useState({
    client: "",
    policyno: "",
    registration: "",
    classification: "",
    start: "",
    expire: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch("https://insurance-nodejs-server.onrender.com/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const newPolicy = await response.json();
        onPolicyAdded(newPolicy);
        setFormData({
          client: "",
          policyno: "",
          registration: "",
          classification: "",
          start: "",
          expire: "",
        });
  
        // Show success alert
        swal("Success!", "Policy has been created successfully.", "success");
      } else {
        console.error("Failed to create policy");
        // Show error alert
        swal("Failed", "Unable to create the policy. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error creating policy:", error);
      // Show error alert
      swal("Error", "An error occurred while creating the policy. Please try again later.", "error");
    }
  };


  return (
    <>
        
        <form onSubmit={handleSubmit}>
          <div className="post-form">
            <label>Client:</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
            />
          </div>
          <div className="post-form">
            <label>Policy No:</label>
            <input
              type="text"
              name="policyno"
              value={formData.policyno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="post-form">
            <label>Registration:</label>
            <input
              type="text"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="post-form">
            <label>Classification:</label>
            <select
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              required
            >
              <option value="">Select Classification</option>
              <option value="TPO">TPO</option>
              <option value="COMP">COMP</option>
            </select>
          </div>
          <div className="post-form">
            <label>Start Date:</label>
            <input
              type="date"
              name="start"
              value={formData.start}
              onChange={handleChange}
              required
            />
          </div>
          <div className="post-form">
            <label>Expire Date:</label>
            <input
              type="date"
              name="expire"
              value={formData.expire}
              onChange={handleChange}
              required
            />
          </div>
          <button className="post-btn" type="submit">Add Policy</button>
        </form>
    </>
  );
};


export default PolicyForm;
