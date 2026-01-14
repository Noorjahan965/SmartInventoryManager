import { useEffect, useState } from "react";
import CreateUser from "../../component/adminPageComponent/CreateUser.jsx";

const AdminPanel = () => {

    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const token = localStorage.getItem("Token");
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-all-users`, {
                headers: {
                Authorization: `Bearer ${token}`,
            }});
            const result = await response.json();
            if (response.status === 200 && result.condition === "SUCCESS") {
                setUsers(result.data.users);
            }
            else if(response.status === 401) {
                window.location.href = '/unauthorized';
            }
            else {
                console.error("Failed to fetch users:", result.message);
            }
        } 
        catch (error) {
            console.error("Network error while fetching users:", error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditUserId(user._id);
        setEditedUser({
            userId: user._id,
            userName: user.userName,
            role: user.role,
            password: "",
            showDropdown: false,
        });
    };

    const handleSaveClick = async () => {
        try {
            const payload = {
                userId: editedUser.userId,
                userName: editedUser.userName,
                role: editedUser.role,
            };

            if (editedUser.password && editedUser.password.trim() !== "") {
                payload.password = editedUser.password;
            }


            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-user`, {

                method: "PUT",
                headers: { "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            console.log(result);//added new

            if (response.status === 200) {
                setEditUserId(null);
                setEditedUser({});
                fetchUsers();
            }
            else {
                console.error("Failed to update user:", result.message);
            }
        } 
        catch (error) {
            console.error("Network error:", error.message);
        }
    };

    const handleInputChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value,
        });
    };

    const toggleDropdown = () => {
        setEditedUser((prev) => ({ ...prev, showDropdown: !prev.showDropdown }));
    };

    const selectRole = (role) => {
        setEditedUser((prev) => ({ ...prev, role, showDropdown: false }));
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/delete-user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({userId: userId})
            });

            const result = await response.json();
            if (response.ok) {
                alert("User deleted successfully");
                // remove from local state
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            }
            else {
                alert(result.message || "Failed to delete user");
            }
        }
        catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the user");
        }
    };

    const handleUserCreated = (newUser) => {
        newUser._id = newUser.userId;
        setUsers((prev) => [...prev, newUser]);
    };



return (
  <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-slate-700">👤 User Management</h2>

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
      >
        ➕ Add User
      </button>
    </div>

    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <table className="min-w-full text-sm sm:text-base">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Username</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Password</th>
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const isEditing = editUserId === user._id;

            return (
              <tr key={user._id} className="hover:bg-blue-50 transition">
                {/* Username */}
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="userName"
                      value={editedUser.userName}
                      onChange={handleInputChange}
                      className="border rounded-md px-2 py-1 w-full focus:ring focus:ring-blue-400"
                    />
                  ) : (
                    <span className="font-medium">{user.userName}</span>
                  )}
                </td>

                {/* Role dropdown */}
                <td className="px-4 py-3 relative">
                  {isEditing ? (
                    <div>
                      <button
                        onClick={toggleDropdown}
                        className="w-full border px-2 py-1 rounded-md bg-white"
                      >
                        {editedUser.role}
                      </button>

                      {editedUser.showDropdown && (
                        <ul className="absolute bg-white shadow-md w-full left-0 mt-1 rounded-md z-10 border">
                          {["ADMIN", "MODERATOR", "USER"].map((role) => (
                            <li
                              key={role}
                              onClick={() => selectRole(role)}
                              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                            >
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <span className="text-blue-700 font-semibold">{user.role}</span>
                  )}
                </td>

                {/* Password */}
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="password"
                      name="password"
                      value={editedUser.password}
                      onChange={handleInputChange}
                      placeholder="New password"
                      className="border rounded-md px-2 py-1 w-full focus:ring focus:ring-blue-400"
                    />
                  ) : (
                    "••••••"
                  )}
                </td>

                {/* Edit / Save */}
                <td className="px-4 py-3">
                  {isEditing ? (
                    <button
                      onClick={handleSaveClick}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md shadow"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md shadow"
                    >
                      Edit
                    </button>
                  )}
                </td>

                {/* Delete */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {showModal && (
      <CreateUser
        onClose={() => setShowModal(false)}
        onUserCreated={handleUserCreated}
      />
    )}
  </div>
);



}

export default AdminPanel;