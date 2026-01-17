import { useEffect, useState } from "react";
import CreateUser from "../../component/adminPageComponent/CreateUser.jsx";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const token = localStorage.getItem("Token");
  const [showModal, setShowModal] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.status === 200 && result.condition === "SUCCESS") {
        setUsers(result.data.users);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (showSavePopup) {
      const timer = setTimeout(() => setShowSavePopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavePopup]);

  // ACTIONS
  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditedUser({
      userId: user._id,
      userName: user.userName,
      role: user.role,
      password: "",
      showDropdown: false
    });
  };

  const selectRole = (role) => {
    setEditedUser(prev => ({
      ...prev,
      role,
      showDropdown: false
    }));
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        userId: editedUser.userId,
        userName: editedUser.userName,
        role: editedUser.role
      };

      if (editedUser.password?.trim()) payload.password = editedUser.password;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditUserId(null);
        fetchUsers();
        setShowSavePopup(true);
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/delete-user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setShowDeletePopup(false);
      }
    } catch (error) { console.error("Delete Error:", error); }
  };

  const handleInputChange = (e) => {
    setEditedUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserCreated = (newUser) => {
    newUser._id = newUser.userId;
    setUsers(prev => [...prev, newUser]);
  };

  const getRoleStyle = (role) => {
    if (role === "ADMIN") return "bg-blue-50 text-blue-700 border-blue-200";
    if (role === "MODERATOR") return "bg-green-50 text-green-700 border-green-300";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto max-md:mt-3 max-md:px-2 mt-6 px-4 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">User Management</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-800 transition text-white font-semibold shadow-md cursor-pointer text-sm">
          + Add User
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block bg-white shadow-lg rounded-2xl border border-slate-200 overflow-visible">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Password</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isEditing = editUserId === user._id;
              return (
                <tr key={user._id}>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {isEditing ? (
                      <input name="userName" value={editedUser.userName} onChange={handleInputChange}
                        className="border rounded px-2 py-1 w-full outline-blue-500" />
                    ) : user.userName}
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="relative">
                        <button
                          onClick={() => setEditedUser(p => ({ ...p, showDropdown: !p.showDropdown }))}
                          className="border rounded px-3 py-1 bg-white text-sm w-32 flex justify-between items-center cursor-pointer"
                        >
                          {editedUser.role}
                          <span className="text-[10px]">▼</span>
                        </button>
                        {editedUser.showDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                            {["ADMIN", "MODERATOR", "USER"].map((r) => (
                              <div key={r} onClick={() => selectRole(r)}
                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg">
                                {r}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                    {isEditing ? (
                      <input type="password" name="password" value={editedUser.password} onChange={handleInputChange}
                        placeholder="New Pwd" className="border rounded px-2 py-1 w-24 text-xs" />
                    ) : "••••••"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={handleSaveClick} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer hover:bg-green-700">Save</button>
                        <button onClick={() => setEditUserId(null)} className="text-slate-500 px-3 py-1 border rounded-lg text-xs cursor-pointer hover:bg-slate-50">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditClick(user)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer">Edit</button>
                        <button onClick={() => { setDeleteUserId(user._id); setShowDeletePopup(true) }} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="sm:hidden space-y-4">
  {users.map((user) => {
    const isEditing = editUserId === user._id;
    return (
      <div
        key={user._id}
        className="bg-white p-4 rounded-2xl shadow border border-slate-100 space-y-3"
      >
        {/* Username */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Username
          </p>
          {isEditing ? (
            <input
              name="userName"
              value={editedUser.userName}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          ) : (
            <p className="font-bold text-slate-800">{user.userName}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Role
          </p>
          {isEditing ? (
            <select
              value={editedUser.role}
              onChange={(e) =>
                setEditedUser((prev) => ({ ...prev, role: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full text-sm"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="USER">USER</option>
            </select>
          ) : (
            <p
              className={`px-2 py-1 text-xs font-bold rounded-lg w-fit border uppercase ${
                user.role === "ADMIN"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : user.role === "MODERATOR"
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {user.role}
            </p>
          )}
        </div>

        {/* Password */}
        {isEditing && (
          <input
            name="password"
            type="password"
            placeholder="New Password"
            value={editedUser.password}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-full text-sm"
          />
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setEditUserId(null)}
                className="flex-1 border border-slate-200 py-2 rounded-xl text-sm font-bold"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEditClick(user)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl font-bold text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setDeleteUserId(user._id);
                  setShowDeletePopup(true);
                }}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-bold text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  })}
</div>


      {/* DELETE POPUP */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs text-center shadow-2xl">
            <p className="font-bold text-lg mb-2 text-slate-800">Delete User?</p>
            <p className="text-sm text-slate-500 mb-6">Are you sure? This will remove access immediately.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeletePopup(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-pointer hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteUserId)} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold cursor-pointer hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showModal && (
        <CreateUser onClose={() => setShowModal(false)} onUserCreated={handleUserCreated} />
      )}

      {/* SAVE SUCCESS POPUP */}
      {showSavePopup && (
        <div className="fixed bottom-10 max-md:w-[65%] left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-150 text-sm font-bold flex items-center gap-2">
          <span>✅</span> Changes Saved Successfully
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
