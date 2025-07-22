import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Car, 
  Calendar, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Clock
} from 'lucide-react';

const NonCoveredVehiclesList = ({ policies }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Function to get vehicles without active coverage
  const getNonCoveredVehicles = () => {
    // Group policies by registration number
    const policiesByRegistration = policies.reduce((acc, policy) => {
      if (!acc[policy.registration]) {
        acc[policy.registration] = [];
      }
      acc[policy.registration].push(policy);
      return acc;
    }, {});

    const nonCoveredVehicles = [];

    // Check each vehicle registration
    Object.keys(policiesByRegistration).forEach(registration => {
      const vehiclePolicies = policiesByRegistration[registration];
      
      // Check if this vehicle has any active policy
      const hasActivePolicy = vehiclePolicies.some(policy => {
        const expireDate = new Date(policy.expire);
        const today = new Date();
        return expireDate > today;
      });

      // If no active policy found, get details of the most recent expired policy
      if (!hasActivePolicy) {
        // Sort policies by expire date (most recent first)
        const sortedPolicies = vehiclePolicies.sort((a, b) => 
          new Date(b.expire) - new Date(a.expire)
        );
        
        const mostRecentPolicy = sortedPolicies[0];
        const expireDate = new Date(mostRecentPolicy.expire);
        const today = new Date();
        const daysSinceExpired = Math.ceil((today - expireDate) / (1000 * 60 * 60 * 24));

        nonCoveredVehicles.push({
          registration: registration,
          client: mostRecentPolicy.client,
          lastPolicyNo: mostRecentPolicy.policyno,
          expiredDate: mostRecentPolicy.expire,
          daysSinceExpired: daysSinceExpired,
          allPolicies: vehiclePolicies.length,
          mostRecentPolicy: mostRecentPolicy
        });
      }
    });

    // Sort by days since expired (most urgent first)
    return nonCoveredVehicles.sort((a, b) => b.daysSinceExpired - a.daysSinceExpired);
  };

  const nonCoveredVehicles = getNonCoveredVehicles();

  // Get urgency level based on days since expired
  const getUrgencyLevel = (daysSinceExpired) => {
    if (daysSinceExpired <= 7) {
      return { level: 'recent', color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Recently Expired' };
    } else if (daysSinceExpired <= 30) {
      return { level: 'moderate', color: 'text-red-600', bgColor: 'bg-red-50', label: 'Needs Attention' };
    } else {
      return { level: 'urgent', color: 'text-red-800', bgColor: 'bg-red-100', label: 'Urgent' };
    }
  };

  if (nonCoveredVehicles.length === 0) {
    return (
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">All Vehicles Covered</h3>
            <p className="text-sm text-green-600">Every vehicle has active insurance coverage.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Non-Covered Vehicles
            </h3>
            <p className="text-sm text-gray-600">
              {nonCoveredVehicles.length} vehicle{nonCoveredVehicles.length !== 1 ? 's' : ''} without active coverage
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {nonCoveredVehicles.length}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Summary Stats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {nonCoveredVehicles.filter(v => v.daysSinceExpired <= 7).length}
                </div>
                <div className="text-xs text-gray-600">Recently Expired</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {nonCoveredVehicles.filter(v => v.daysSinceExpired > 7 && v.daysSinceExpired <= 30).length}
                </div>
                <div className="text-xs text-gray-600">Need Attention</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-800">
                  {nonCoveredVehicles.filter(v => v.daysSinceExpired > 30).length}
                </div>
                <div className="text-xs text-gray-600">Urgent</div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="max-h-96 overflow-y-auto">
            {nonCoveredVehicles.map((vehicle, index) => {
              const urgency = getUrgencyLevel(vehicle.daysSinceExpired);
              
              return (
                <div 
                  key={vehicle.registration}
                  className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${urgency.bgColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        {/* Registration */}
                        <div className="flex items-center space-x-2">
                          <Car size={16} className="text-gray-400" />
                          <span className="font-mono font-semibold text-gray-900">
                            {vehicle.registration}
                          </span>
                        </div>
                        
                        {/* Client */}
                        <div className="flex items-center space-x-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-gray-700">
                            {vehicle.client}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        {/* Last Policy */}
                        <div className="flex items-center space-x-1">
                          <FileText size={14} className="text-gray-400" />
                          <span>Last Policy: {vehicle.lastPolicyNo}</span>
                        </div>
                        
                        {/* Expired Date */}
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Expired: {new Date(vehicle.expiredDate).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Total Policies */}
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {vehicle.allPolicies} total policies
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Days Since Expired */}
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${urgency.color} ${urgency.bgColor} border`}>
                        <Clock size={12} className="mr-1" />
                        {vehicle.daysSinceExpired} days ago
                      </div>
                      <div className={`text-xs mt-1 ${urgency.color} font-medium`}>
                        {urgency.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              Contact these clients to renew their insurance policies
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Simplified version that just returns the data
const useNonCoveredVehicles = (policies) => {
  const getNonCoveredVehicles = () => {
    const policiesByRegistration = policies.reduce((acc, policy) => {
      if (!acc[policy.registration]) {
        acc[policy.registration] = [];
      }
      acc[policy.registration].push(policy);
      return acc;
    }, {});

    const nonCoveredVehicles = [];

    Object.keys(policiesByRegistration).forEach(registration => {
      const vehiclePolicies = policiesByRegistration[registration];
      
      const hasActivePolicy = vehiclePolicies.some(policy => {
        const expireDate = new Date(policy.expire);
        const today = new Date();
        return expireDate > today;
      });

      if (!hasActivePolicy) {
        const sortedPolicies = vehiclePolicies.sort((a, b) => 
          new Date(b.expire) - new Date(a.expire)
        );
        
        const mostRecentPolicy = sortedPolicies[0];
        const expireDate = new Date(mostRecentPolicy.expire);
        const today = new Date();
        const daysSinceExpired = Math.ceil((today - expireDate) / (1000 * 60 * 60 * 24));

        nonCoveredVehicles.push({
          registration: registration,
          client: mostRecentPolicy.client,
          lastPolicyNo: mostRecentPolicy.policyno,
          expiredDate: mostRecentPolicy.expire,
          daysSinceExpired: daysSinceExpired,
          allPolicies: vehiclePolicies.length,
          mostRecentPolicy: mostRecentPolicy
        });
      }
    });

    return nonCoveredVehicles.sort((a, b) => b.daysSinceExpired - a.daysSinceExpired);
  };

  return getNonCoveredVehicles();
};

export { NonCoveredVehiclesList, useNonCoveredVehicles };
export default NonCoveredVehiclesList;