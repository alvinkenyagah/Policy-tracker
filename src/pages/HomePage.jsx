import React, { useState } from 'react';
import { FileText, Plus, BarChart3, Shield } from 'lucide-react';
import PolicyForm from "../components/policyForm";
import PolicyTable from "../components/PolicyTable";

function HomePage() {
  const [policies, setPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const addPolicy = (newPolicy) => {
    setPolicies([...policies, newPolicy]);
    // Auto-switch to overview tab after adding policy
    setActiveTab('overview');
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Policy Overview',
      icon: FileText,
      description: 'View and manage all policies'
    },
    {
      id: 'add-policy',
      label: 'Add Policy',
      icon: Plus,
      description: 'Create new insurance policy'
    }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PolicyTable policies={policies} setPolicies={setPolicies} />;
      case 'add-policy':
        return <PolicyForm onPolicyAdded={addPolicy} />;
      default:
        return <PolicyTable policies={policies} setPolicies={setPolicies} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
              <p className="text-gray-600 mt-1">Manage your insurance policies efficiently</p>
            </div>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      <span>{tab.label}</span>
                    </div>
                    
                    {/* Active tab indicator */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Tab Description */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>

            {/* Content with smooth transition */}
            <div className="transition-all duration-300 ease-in-out">
              {getTabContent()}
            </div>
          </div>
        </div>

        {/* Quick Actions (floating) */}
        {activeTab === 'overview' && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setActiveTab('add-policy')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-200 group"
              title="Add New Policy"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        )}

        {/* Success indicator when policy is added */}
        {activeTab === 'overview' && policies.length > 0 && (
          <div className="fixed bottom-6 left-6 z-40">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm font-medium">
                {policies.length} {policies.length === 1 ? 'Policy' : 'Policies'} Loaded
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;