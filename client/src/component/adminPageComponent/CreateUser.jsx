import { useState } from "react";

const CreateUser = ({ onClose, onUserCreated }) => {
  const token = localStorage.getItem("Token");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👉 Step 1: Open confirm popup instead of saving directly
  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  // 👉 Step 2: Actually create user after confirmation
  const handleCreateUser = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.condition === "SUCCESS") {
        setPopup({
          show: true,
          message: "User created successfully!",
          type: "success",
        });
        onUserCreated(result.data.user);

        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
          onClose();
        }, 2000);
      } else {
        setPopup({
          show: true,
          message: result.message || "Failed to create user",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setPopup({
        show: true,
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ========= MAIN MODAL (HIDDEN when confirm popup is open) ========= */}
      {!showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 animate-scaleIn">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Create User
            </h2>

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
                type="button"
                onClick={handleSaveClick}
                className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========= CONFIRM SAVE POPUP ========= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-360px text-center shadow-xl animate-scaleIn">
            <h3 className="text-lg font-semibold mb-2">Confirm Save</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to save this user?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========= SUCCESS / ERROR TOAST (TOP) ========= */}
      {popup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 animate-slideDown">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg bg-white border-l-6 ${
              popup.type === "success"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <span
              className={`text-lg ${
                popup.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "✅" : "❌"}
            </span>
            <p className="text-slate-700 font-medium text-base">
              {popup.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUser;
