// src/components/AddUserModal.jsx
import { useState } from "react";

const CreateUser = ({ onClose, onUserCreated }) => {
  const token = localStorage.getItem("Token");
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/create-user`, 

        {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" ,
            Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      

      if (response.ok) {
        alert("User created successfully");
        onUserCreated(result.data.user); // Notify parent
        onClose(); // Close modal
      }
      else {
        alert(result.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-80 animate-scaleIn">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Create User</h2>

      <input
        type="text"
        name="userName"
        placeholder="Username"
        className="w-full mb-3 border rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
        value={formData.userName}
        onChange={handleChange}
      />

      <select
        name="role"
        className="w-full mb-3 border rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="">Select Role</option>
        <option value="ADMIN">ADMIN</option>
        <option value="MODERATOR">MODERATOR</option>
        <option value="USER">USER</option>
      </select>

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full mb-4 border rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleCreateUser}
          className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
}

export default CreateUser;