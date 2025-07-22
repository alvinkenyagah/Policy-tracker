import React from 'react';
import { Shield } from 'lucide-react';

const ExpiredPoliciesStat = ({ policies }) => {
  // Function to get truly expired policies (vehicles without active coverage)
  const getTrulyExpiredPolicies = () => {
    // Group policies by registration number
    const policiesByRegistration = policies.reduce((acc, policy) => {
      if (!acc[policy.registration]) {
        acc[policy.registration] = [];
      }
      acc[policy.registration].push(policy);
      return acc;
    }, {});

    let trulyExpiredCount = 0;

    // Check each vehicle registration
    Object.keys(policiesByRegistration).forEach(registration => {
      const vehiclePolicies = policiesByRegistration[registration];
      
      // Check if this vehicle has any active policy
      const hasActivePolicy = vehiclePolicies.some(policy => {
        const expireDate = new Date(policy.expire);
        const today = new Date();
        return expireDate > today; // Policy is still active
      });

      // If no active policy found, this vehicle is truly expired
      if (!hasActivePolicy) {
        trulyExpiredCount++;
      }
    });

    return trulyExpiredCount;
  };

  const trulyExpiredCount = getTrulyExpiredPolicies();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Expired Policies</p>
          <p className="text-xs text-gray-500 mt-1">Vehicles without active coverage</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {trulyExpiredCount}
          </p>
        </div>
        <div className="bg-red-100 p-3 rounded-lg">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
      </div>
    </div>
  );
};

// Alternative implementation with more detailed breakdown
const DetailedExpiredPoliciesStat = ({ policies }) => {
  // Function to analyze policy status by registration
  const analyzePolicyStatus = () => {
    const policiesByRegistration = policies.reduce((acc, policy) => {
      if (!acc[policy.registration]) {
        acc[policy.registration] = [];
      }
      acc[policy.registration].push(policy);
      return acc;
    }, {});

    let trulyExpiredCount = 0;
    let totalExpiredPolicies = 0;
    let renewedVehicles = 0;

    Object.keys(policiesByRegistration).forEach(registration => {
      const vehiclePolicies = policiesByRegistration[registration];
      
      // Count all expired policies for this vehicle
      const expiredPolicies = vehiclePolicies.filter(policy => {
        const expireDate = new Date(policy.expire);
        const today = new Date();
        return expireDate <= today;
      });
      
      totalExpiredPolicies += expiredPolicies.length;

      // Check if this vehicle has any active policy
      const hasActivePolicy = vehiclePolicies.some(policy => {
        const expireDate = new Date(policy.expire);
        const today = new Date();
        return expireDate > today;
      });

      if (!hasActivePolicy) {
        trulyExpiredCount++;
      } else if (expiredPolicies.length > 0) {
        renewedVehicles++;
      }
    });

    return {
      trulyExpiredCount,
      totalExpiredPolicies,
      renewedVehicles
    };
  };

  const { trulyExpiredCount, totalExpiredPolicies, renewedVehicles } = analyzePolicyStatus();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Expired Policies</p>
            <div className="bg-red-100 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-red-600">
                {trulyExpiredCount}
              </p>
              <p className="text-xs text-gray-500">Vehicles without coverage</p>
            </div>
            
            {renewedVehicles > 0 && (
              <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {renewedVehicles} vehicles renewed • {totalExpiredPolicies - trulyExpiredCount} old policies excluded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export both components
export { ExpiredPoliciesStat, DetailedExpiredPoliciesStat };
export default ExpiredPoliciesStat;