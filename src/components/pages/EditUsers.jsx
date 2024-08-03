/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon } from "@heroicons/react/20/solid";

const EditUser = () => {
  const { id } = useParams();
  // const [formData, setFormData] = useState({
  //   firstname: "",
  //   lastname: "",
  //   email: "",
  //   phone: ""
  // });
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://rra-report-management-system-backend.onrender.com/account/get_user/" + id)
      .then((res) => {
        if (res.data) {
          // setFormData({
          //   firstname: res.data.firstname,
          //   lastname: res.data.lastname,
          //   email: res.data.email,
          //   phone: res.data.phone
          // });

          console.log("The related data is:", res.data);
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios
  //     .put(`http://127.0.0.1:8000/account/update_user/${id}`, formData)
  //     .then(() => {
  //       navigate("/users"); // Redirect to the users list or some other page
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleSubmit =(e) =>{
    e.preventDefault()
    try{

        axios.put('https://rra-report-management-system-backend.onrender.com/account/user_edit/'+id, data)
        .then((res) =>{
            if(res.data){
                alert('Data Updataed successful');
                navigate('/admin/users');
            }
        })

    }catch(err)
    {console.log("Errer Updating contact", err);

    }

}

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Update User
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-2">
              <input
                id="first_name"
                name="first_name"
                type="text"
                // value={formData.firstname}
                // onChange={handleChange}
                value={data.first_name} onChange={e=> setData({...data, first_name: e.target.value})}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="last_name"
                name="last_name"
                type="text"
                // value={formData.lastname}
                // onChange={handleChange}
                value={data.last_name} onChange={e=> setData({...data, last_name: e.target.value})}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                // value={formData.email}
                // onChange={handleChange}
                value={data.email} onChange={e=> setData({...data, email: e.target.value})}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="text"
                // value={formData.phone}
                // onChange={handleChange}
                value={data.phone} onChange={e=> setData({...data, phone: e.target.value})}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-purple-400 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Update
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Have an account?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EditUser;
