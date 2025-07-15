import React, { useState, Fragment } from 'react';
import { FileText, Plus, BarChart3, Shield, X } from 'lucide-react';
import PolicyTable from "../components/PolicyTable";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

// Policy Form Component (integrated into modal)
const PolicyFormModal = ({ onPolicyAdded, onClose }) => {
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
        
        // Show success and close modal
        alert("Success! Policy has been created successfully.");
        onClose();
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
    w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 
    focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
    transition-all duration-200 
    ${errors[fieldName] 
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-200 hover:border-gray-300'
    }
  `;

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
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
            Client Name
          </label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="Enter client full name"
            className={inputClasses('client')}
            required
          />
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
            Policy Number
          </label>
          <input
            type="text"
            name="policyno"
            value={formData.policyno}
            onChange={handleChange}
            placeholder="Enter policy number"
            className={inputClasses('policyno')}
            required
          />
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
            Vehicle Registration
          </label>
          <input
            type="text"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
            placeholder="Enter vehicle registration number"
            className={inputClasses('registration')}
            required
          />
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
            Policy Classification
          </label>
          <div className="relative">
            <select
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              className={inputClasses('classification')}
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
              Start Date
            </label>
            <input
              type="date"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className={inputClasses('start')}
              required
            />
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
              Expiry Date
            </label>
            <input
              type="date"
              name="expire"
              value={formData.expire}
              onChange={handleChange}
              className={inputClasses('expire')}
              required
            />
            {errors.expire && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.expire}</span>
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Creating...</span>
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
  );
};

// Main HomePage Component
function HomePage() {
  const [policies, setPolicies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addPolicy = (newPolicy) => {
    setPolicies([...policies, newPolicy]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Use full width container for the entire page */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
                <p className="text-gray-600 mt-1">Manage your insurance policies efficiently</p>
              </div>
            </div>
            
            {/* Add Policy Button in Header */}
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Policy</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Policies</p>
                  <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Policies</p>
                  <p className="text-2xl font-bold text-green-600">
                    {policies.filter(policy => {
                      const expireDate = new Date(policy.expire);
                      const today = new Date();
                      return expireDate > today;
                    }).length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired Policies</p>
                  <p className="text-2xl font-bold text-red-600">
                    {policies.filter(policy => {
                      const expireDate = new Date(policy.expire);
                      const today = new Date();
                      return expireDate <= today;
                    }).length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Policy Overview</h2>
            <p className="text-gray-600 text-sm mt-1">View and manage all policies</p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <PolicyTable policies={policies} setPolicies={setPolicies} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-200 group"
            title="Add New Policy"
          >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Success indicator */}
        {policies.length > 0 && (
          <div className="fixed bottom-6 left-6 z-40">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {policies.length} {policies.length === 1 ? 'Policy' : 'Policies'} Loaded
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PolicyFormModal onPolicyAdded={addPolicy} onClose={closeModal} />
      </Modal>
    </div>
  );
}

export default HomePage;