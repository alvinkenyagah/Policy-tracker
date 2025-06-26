import React, { useState } from "react";
import { User, FileText, Car, Shield, Calendar, CalendarX, Plus, Loader2 } from "lucide-react";

const PolicyForm = ({ onPolicyAdded }) => {
  const [formData, setFormData] = useState({
    client: "",
    policyno: "",
    registration: "",
    classification: "",
    start: "",
    expire: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.client.trim()) newErrors.client = "Client name is required";
    if (!formData.policyno.trim()) newErrors.policyno = "Policy number is required";
    if (!formData.registration.trim()) newErrors.registration = "Registration is required";
    if (!formData.classification) newErrors.classification = "Classification is required";
    if (!formData.start) newErrors.start = "Start date is required";
    if (!formData.expire) newErrors.expire = "Expire date is required";
    
    // Validate that expire date is after start date
    if (formData.start && formData.expire && new Date(formData.expire) <= new Date(formData.start)) {
      newErrors.expire = "Expire date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
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
        setErrors({});
  
        // Show success alert
        alert("Success! Policy has been created successfully.");
      } else {
        console.error("Failed to create policy");
        alert("Failed to create the policy. Please try again.");
      }
    } catch (error) {
      console.error("Error creating policy:", error);
      alert("An error occurred while creating the policy. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 
    focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
    transition-all duration-200 
    ${errors[fieldName] 
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-200 hover:border-gray-300'
    }
  `;

  const selectClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 bg-white border-2 rounded-xl text-gray-900 
    focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
    transition-all duration-200 appearance-none
    ${errors[fieldName] 
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-200 hover:border-gray-300'
    }
  `;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Policy</h2>
              <p className="text-blue-100 text-sm">Create a new insurance policy for your client</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Client Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-1"> <User className=" h-5 w-5 text-gray-400" />
              Client Name
              </span>
            </label>
            <div className="relative">

              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Enter client full name"
                className={inputClasses('client')}
                required
              />
            </div>
            {errors.client && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.client}</span>
              </p>
            )}
          </div>

          {/* Policy Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
               <span className="flex items-center gap-1">
                <FileText className="h-5 w-5 text-gray-400" />
                Policy Number
               </span>
              
            </label>
            <div className="relative">
              
              <input
                type="text"
                name="policyno"
                value={formData.policyno}
                onChange={handleChange}
                placeholder="Enter policy number"
                className={inputClasses('policyno')}
                required
              />
            </div>
            {errors.policyno && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.policyno}</span>
              </p>
            )}
          </div>

          {/* Registration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
               <span className="flex items-center gap-1">
              <Car className="h-5 w-5 text-gray-400" />
              Vehicle Registration
              </span>
            </label>
            <div className="relative">
              
              <input
                type="text"
                name="registration"
                value={formData.registration}
                onChange={handleChange}
                placeholder="Enter vehicle registration number"
                className={inputClasses('registration')}
                required
              />
            </div>
            {errors.registration && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.registration}</span>
              </p>
            )}
          </div>

          {/* Classification */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                <Shield className="h-5 w-5 text-gray-400" />
                Policy Classification
              </span>
            </label>
            <div className="relative">
              
              <select
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                className={selectClasses('classification')}
                required
              >
                <option value="">Select policy type</option>
                <option value="TPO">Third Party Only (TPO)</option>
                <option value="COMP">Comprehensive (COMP)</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.classification && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.classification}</span>
              </p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                 <span className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                   Start Date
                 </span>       
              </label>
              <div className="relative">
                
                <input
                  type="date"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className={inputClasses('start')}
                  required
                />
              </div>
              {errors.start && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.start}</span>
                </p>
              )}
            </div>

            {/* Expire Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                 <span className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                   Expirey Date
                 </span>       
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="expire"
                  value={formData.expire}
                  onChange={handleChange}
                  className={inputClasses('expire')}
                  required
                />
              </div>
              {errors.expire && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.expire}</span>
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Policy...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Policy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyForm;