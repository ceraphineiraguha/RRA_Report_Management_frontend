/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function UserPolicy() {
  const [policyData, setPolicyData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');

  const handleFetch = async () => {
    try {
      const res = await axios.get(
        "https://rra-report-management-system-backend.onrender.com/institution/view_all_policies/"
      );
      if (res.data) {
        setPolicyData(res.data);
        const uniqueDepartments = [...new Set(res.data.map(policy => policy.department.name))];
        const uniqueInstitutions = [...new Set(res.data.map(policy => policy.department.institution.name))];
        setDepartments(uniqueDepartments);
        setInstitutions(uniqueInstitutions);
      } else {
        console.log("error listing policies");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleInstitutionChange = (e) => {
    setSelectedInstitution(e.target.value);
  };

  const filteredPolicies = policyData.filter(policy =>
    (selectedDepartment === 'all' || policy.department.name === selectedDepartment) &&
    (selectedInstitution === 'all' || policy.department.institution.name === selectedInstitution)
  );

  return (
    <>
      <h1 className="text-center text-black text-xl capitalize mb-4">
        {/* Policies */}
      </h1>
      <div className="flex justify-between mb-4">
        <div>
          <select onChange={handleDepartmentChange} value={selectedDepartment} className="px-4 py-2 bg-white text-black border rounded-full">
            <option value="all">All Departments</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
          <select onChange={handleInstitutionChange} value={selectedInstitution} className="ml-4 px-4 py-2 bg-white text-black border rounded-full">
            <option value="all">All Institutions</option>
            {institutions.map((institution, index) => (
              <option key={index} value={institution}>{institution}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Institution
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {policy.name}
                  </th>
                  <td className="px-6 py-4">{policy.department.name}</td>
                  <td className="px-6 py-4">
                    {policy.department.institution.name}
                  </td>
                  <td className="px-6 py-4">{policy.description}</td>
                  <td className="px-6 py-4">
                    {policy.department.institution.created_at}
                  </td>
                  <td className="px-6 py-4">
                  <Link to={`/user/userreply/${policy.id}`} className=' px-4 py-2'>Add Comment</Link>
                  </td>

                  

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No policies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserPolicy;
