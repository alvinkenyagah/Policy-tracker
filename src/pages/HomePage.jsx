import React, { useState } from 'react';
import PolicyForm from "../components/policyForm";
import PolicyTable from "../components/PolicyTable";


function HomePage() {
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addPolicy = (newPolicy) => {
    setPolicies([...policies, newPolicy]);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="App">
      <h1>Policy Management</h1>
      <button onClick={toggleFormVisibility}>
        {showForm ? 'Hide Form' : 'Show Form'}
      </button>
      <br />
      {showForm && <PolicyForm onPolicyAdded={addPolicy} />}
      <br />
      <PolicyTable policies={policies} setPolicies={setPolicies} />
    </div>
  );
}

export default HomePage;
