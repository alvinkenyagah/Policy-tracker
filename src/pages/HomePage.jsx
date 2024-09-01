import React, { useState } from 'react';
import PolicyForm from "../components/policyForm";
import PolicyTable from "../components/PolicyTable";


function HomePage() {
    const [policies, setPolicies] = useState([]);
  
    const addPolicy = (newPolicy) => {
      setPolicies([...policies, newPolicy]);
    };
  
    return (
      <div className="App">
        <h1>Policy Management</h1>
        <PolicyForm onPolicyAdded={addPolicy} />
        <br/>
        <PolicyTable policies={policies} setPolicies={setPolicies} />
      </div>
    );
  }
  
export default HomePage