/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Users() {
  const [userData, setUserData] = useState([]);

  // const navigate= useNavigate();

  const handleFetch = async () => {
    try {
      const res = await axios.get('https://rra-report-management-system-backend.onrender.com/account/view_all_users/');
      if (res.data) {
        setUserData(res.data); // Adjusted to match the example response structure
      } else {
        console.log("error listing users");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleDelete = async (id) => {
    const conf = window.confirm("Do you want to delete this user?");
    if (conf) {
      try {
        const res = await axios.delete('https://rra-report-management-system-backend.onrender.com/account/delete_user/'+id);
        if (res.status === 204) { // Assuming 204 No Content on successful delete
          alert("User deleted successfully");
          setUserData(prevUserData => prevUserData.filter(user => user.id !== id)); // Update state to remove deleted user
        } else {
          alert("Failed to delete user");
        }
      } catch (err) {
        console.error("Error deleting user", err);
        alert("An error occurred while deleting the user");
      }
    }
  };

  return (
    <>
      <h1 className='text-center text-black text-xl capitalize mb-4'>Users</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">First Name</th>
              <th scope="col" className="px-6 py-3">Last Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((user, index) => (
                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.first_name}
                  </th>
                  <td className="px-6 py-4">{user.last_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">
                    {/* <Link to={} className=' text-blue-500'>Edit</Link> */}
                    <Link to={`/admin/edituser/${user.id}`} className=' px-4 py-2'>Edit</Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-2 py-2 rounded-xl bg-gray-700 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

//   function handleSubmit(id) {
//     const conf = window.confirm("Do you want to dalate this Contact");

//     if (conf) {
//         try {
//             axios.delete('http://127.0.0.1:8000/account/user_edit/'+id)
//             .then((res) =>{
//                 if(res.data){
//                     alert("user deleted successfull");
//                     navigate('/admin/users');
//                 }
//             })
//         } catch (err) {
//             console.log("Error Deleting Contact", err)
//         }
//     }

// }
}


export default Users;
