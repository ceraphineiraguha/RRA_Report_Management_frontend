/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://rra-report-management-system-backend.onrender.com/contact/",
        formData
      );
      if (response.data) {
        alert("Message sent successfully");
        setFormData({
          name: "",
          email: "",
          subject: "",
          description: "", // corrected
        });
      }
    } catch (error) {
      console.error("Error sending message", error.response.data);
      alert(`Error: ${error.response.data.error || "Failed to send message"}`);
    }
  };

  return (
    <section id="contact" className="py-12">
      <div className="container mx-auto px-4">
        <h2
          data-aos="fade-up"
          className="text-headingColor font-bold text-3xl mb-8 text-center"
        >
          Write to Us
        </h2>
        <div className="flex justify-center items-center">
          <div
            data-aos="fade-left"
            className="w-full max-w-md mt-8 sm:h-[450px] flex items-center bg-indigo-100 px-4 lg:px-8 py-8 mb-14 rounded-lg shadow-lg"
          >
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 focus:outline-none rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 focus:outline-none rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 focus:outline-none rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-5">
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Write your message"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 focus:outline-none rounded-md border border-gray-300"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-1 w-full p-3 focus:outline-none rounded-md bg-gray-500 text-white hover:bg-headingColor ease-linear duration-150"
              >
                <i className="ri-mail-send-line text-2xl"></i>Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
