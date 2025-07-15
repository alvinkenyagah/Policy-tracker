import React, { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Trash2, Filter, X, Calendar, Users, FileText, Car, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import swal from 'sweetalert';

const PolicyTable = ({ policies, setPolicies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!policies.length) {
      setLoading(true);
      const token = localStorage.getItem('token');

      fetch('https://insurance-nodejs-server.onrender.com/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setPolicies(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [policies, setPolicies]);

  const deletePolicy = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const confirmDeletion = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this policy!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (confirmDeletion) {
        const response = await fetch(`https://insurance-nodejs-server.onrender.com/api/transactions/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          method: 'DELETE',
        });
        if (response.ok) {
          setPolicies(policies.filter(policy => policy._id !== id));
          swal("Policy deleted successfully!", {
            icon: "success",
          });
        } else {
          console.error('Failed to delete policy');
          swal("Failed to delete policy", {
            icon: "error",
          });
        }
      } else {
        swal("Your policy is safe!");
      }
    } catch (error) {
      console.error('Error deleting policy:', error);
      swal("An error occurred!", "Please try again later.", "error");
    }
  };

  const calculateDaysLeft = (expireDate) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const timeDifference = expire - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = (daysLeft) => {
    if (daysLeft > 30) {
      return { status: 'active', color: '#10b981', bgColor: '#ecfdf5', icon: CheckCircle };
    } else if (daysLeft > 0) {
      return { status: 'expiring', color: '#f59e0b', bgColor: '#fffbeb', icon: Clock };
    } else {
      return { status: 'expired', color: '#ef4444', bgColor: '#fef2f2', icon: AlertTriangle };
    }
  };

  const filteredPolicies = policies
    .filter(policy => {
      const matchesSearch = policy.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.policyno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.registration.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClient = selectedClient ? policy.client === selectedClient : true;
      const matchesRegistration = selectedRegistration ? policy.registration === selectedRegistration : true;
      
      let matchesStatus = true;
      if (selectedStatus) {
        const daysLeft = calculateDaysLeft(policy.expire);
        if (selectedStatus === 'active') {
          matchesStatus = daysLeft > 30;
        } else if (selectedStatus === 'expiring') {
          matchesStatus = daysLeft <= 30 && daysLeft > 0;
        } else if (selectedStatus === 'expired') {
          matchesStatus = daysLeft < 0;
        }
      }
      
      return matchesSearch && matchesClient && matchesRegistration && matchesStatus;
    });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    if (sortConfig !== null) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleClientClick = (client) => {
    setSelectedClient(client === selectedClient ? null : client);
  };

  const handleRegistrationClick = (registration) => {
    setSelectedRegistration(registration === selectedRegistration ? null : registration);
  };

  const clearFilters = () => {
    setSelectedClient(null);
    setSelectedRegistration(null);
    setSelectedStatus(null);
    setSearchTerm('');
  };

  const uniqueClients = [...new Set(policies.map(p => p.client))];
  const uniqueRegistrations = [...new Set(policies.map(p => p.registration))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading policies...</span>
      </div>
    );
  }

  return (

    <>
    
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FileText className="mr-2" size={20} />
          Insurance Policies
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          {filteredPolicies.length} of {policies.length} policies shown
        </p>
      </div>


            {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle size={16} className="mr-1 text-green-600" />
            Active: {sortedPolicies.filter(p => calculateDaysLeft(p.expire) > 30).length}
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-yellow-600" />
            Expiring Soon: {sortedPolicies.filter(p => {
              const days = calculateDaysLeft(p.expire);
              return days <= 30 && days > 0;
            }).length}
          </div>
          <div className="flex items-center">
            <AlertTriangle size={16} className="mr-1 text-red-600" />
            Expired: {sortedPolicies.filter(p => calculateDaysLeft(p.expire) < 0).length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
           <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                  <Search className="h-5 w-5 text-gray-400" />
                      Search

                {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by client, policy no, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

              </span>       
            </label>
          

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter size={16} className="mr-2" />
            Filters
            {(selectedClient || selectedRegistration || selectedStatus) && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {(selectedClient ? 1 : 0) + (selectedRegistration ? 1 : 0) + (selectedStatus ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Client
                </label>
                <select
                  value={selectedClient || ''}
                  onChange={(e) => setSelectedClient(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All clients</option>
                  {uniqueClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>

              {/* Registration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car size={16} className="inline mr-1" />
                  Registration
                </label>
                <select
                  value={selectedRegistration || ''}
                  onChange={(e) => setSelectedRegistration(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All registrations</option>
                  {uniqueRegistrations.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle size={16} className="inline mr-1" />
                  Status
                </label>
                <select
                  value={selectedStatus || ''}
                  onChange={(e) => setSelectedStatus(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All statuses</option>
                  <option value="active">🟢 Active (30+ days)</option>
                  <option value="expiring">🟡 Expiring Soon (≤30 days)</option>
                  <option value="expired">🔴 Expired</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedClient || selectedRegistration || selectedStatus || searchTerm) && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              {[
                { key: 'createdAt', label: 'Created', icon: Calendar },
                { key: 'client', label: 'Client', icon: Users },
                { key: 'policyno', label: 'Policy No', icon: FileText },
                { key: 'registration', label: 'Registration', icon: Car },
                { key: 'start', label: 'Start Date', icon: Calendar },
                { key: 'expire', label: 'Expire Date', icon: Calendar },
                { key: null, label: 'Status', icon: null },
                { key: null, label: 'Actions', icon: null },
              ].map(({ key, label, icon: Icon }) => (
                <th
                  key={label}
                  onClick={key ? () => requestSort(key) : undefined}
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200 last:border-r-0 ${
                    key ? 'cursor-pointer hover:bg-gray-200 transition-all duration-200 select-none' : ''
                  } ${sortConfig?.key === key ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon size={14} className={sortConfig?.key === key ? 'text-blue-600' : 'text-gray-500'} />}
                    <span className="font-semibold">{label}</span>
                    {key && sortConfig?.key === key && (
                      <div className="flex flex-col">
                        {sortConfig.direction === 'ascending' 
                          ? <ChevronUp size={14} className="text-blue-600" />
                          : <ChevronDown size={14} className="text-blue-600" />
                        }
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white  divide-gray-100">
            {sortedPolicies.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <FileText size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No policies found</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      {searchTerm || selectedClient || selectedRegistration || selectedStatus
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Get started by adding your first insurance policy."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedPolicies.map((policy, index) => {
                const daysLeft = calculateDaysLeft(policy.expire);
                const daysSinceExpired = daysLeft < 0 ? Math.abs(daysLeft) : null;
                const statusInfo = getStatusInfo(daysLeft);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={policy._id} className={`hover:bg-blue-50 transition-all duration-200 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium border-r border-gray-100">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold cursor-pointer transition-all duration-200 border-r border-gray-100 ${
                        selectedClient === policy.client 
                          ? 'text-blue-700 bg-blue-100' 
                          : 'text-gray-900 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => handleClientClick(policy.client)}
                    >
                      <div className="flex items-center">
                        <Users size={14} className="mr-2 text-gray-400" />
                        <span className="truncate">{policy.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono border-r border-gray-100">
                      <div className="flex items-center">
                        <FileText size={14} className="mr-2 text-gray-400" />
                        {policy.policyno}
                      </div>
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold cursor-pointer transition-all duration-200 border-r border-gray-100 ${
                        selectedRegistration === policy.registration 
                          ? 'text-blue-700 bg-blue-100' 
                          : 'text-gray-900 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => handleRegistrationClick(policy.registration)}
                    >
                      <div className="flex items-center">
                        <Car size={14} className="mr-2 text-gray-400" />
                        <span className="font-mono">{policy.registration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-green-500" />
                        {new Date(policy.start).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-red-500" />
                        {new Date(policy.expire).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                      <div 
                        className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold shadow-sm border"
                        style={{ 
                          color: statusInfo.color, 
                          backgroundColor: statusInfo.bgColor,
                          borderColor: statusInfo.color + '30'
                        }}
                      >
                        <StatusIcon size={12} className="mr-1.5" />
                        <span>
                          {daysLeft >= 0 
                            ? `${daysLeft} days left`
                            : `Expired ${daysSinceExpired} days ago`
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deletePolicy(policy._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-60 border border-transparent hover:border-red-200"
                        title="Delete policy"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default PolicyTable;