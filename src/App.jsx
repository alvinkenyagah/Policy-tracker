// // src/App.js
// import React from 'react';
// import PolicyTable from './components/PolicyTable';

// function App() {
//   return (
//     <div className="App">
//       <h1>Policy Management</h1>
//       <PolicyTable />
//     </div>
//   );
// }

// export default App;


// src/App.js
import React, { useState } from 'react';
// import PolicyTable from './components/PolicyTable';
// import PolicyForm from './components/PolicyForm';

import PolicyTable from './components/PolicyTable';
import PolicyForm from './components/policyForm';
function App() {
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

export default App;
