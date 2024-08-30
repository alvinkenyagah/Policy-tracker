// src/components/PolicyTable.js
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

const PolicyTable = ({ policies, setPolicies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    if (!policies.length) {
      fetch('http://localhost:3000/api/transactions')
        .then(response => response.json())
        .then(data => setPolicies(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [policies, setPolicies]);

const deletePolicy = async (id) => {
  try {
    const confirmDeletion = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this policy!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmDeletion) {
      const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPolicies(policies.filter(policy => policy._id !== id));
        swal("Poof! Your policy has been deleted!", {
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

  const filteredPolicies = policies.filter(policy =>
    policy.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policyno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>

      <input
        type="text"
        placeholder="Search by Client, Policy No or Registration"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    <div>
    <style>
  {`
  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #89b1d6;
    cursor:pointer;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
 
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }




  tr:hover {
    background-color: #ddd;
    cursor:pointer;
  }



  @media only screen and (max-width: 600px) {
    /* Styles specific to mobile view */
    th, td {
      white-space: nowrap; /* Prevent text wrapping */
    }
  }

  
  `}
</style>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('client')}>Client</th>
            <th onClick={() => requestSort('policyno')}>Policy No</th>
            <th onClick={() => requestSort('registration')}>Registration</th>
            <th onClick={() => requestSort('start')}>Start Date</th>
            <th onClick={() => requestSort('expire')}>Expire Date</th>
            <th>Days Left</th>
            <th>Days Since Expired</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPolicies.map((policy) => {
            const daysLeft = calculateDaysLeft(policy.expire);
            const daysSinceExpired = daysLeft < 0 ? Math.abs(daysLeft) : null;

            return (
              <tr key={policy._id}>
                <td>{policy.client}</td>
                <td>{policy.policyno}</td>
                <td>{policy.registration}</td>
                <td>{new Date(policy.start).toLocaleDateString()}</td>
                <td>{new Date(policy.expire).toLocaleDateString()}</td>
                <td>{daysLeft >= 0 ? daysLeft : '-'}</td>
                <td style={{color:"red"}}>{daysSinceExpired || '-'}</td>
                <td>
                  <button onClick={() => deletePolicy(policy._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PolicyTable;




