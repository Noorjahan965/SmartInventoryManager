import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const status = await isLoggedIn();
      if (status) navigate("/home");
    })();
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username.trim(), password: password.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("Token", data.data.jwtToken);
        localStorage.setItem("UserId", data.data.user.userId);
        localStorage.setItem("UserName", data.data.user.userName);
        localStorage.setItem("Role", data.data.user.role);
        navigate("/home");
      } else alert(data.message || "Login failed");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-8 border border-white/30 animate-fadeIn">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828486.png"
              className="w-10 h-10"
              alt="Lock Icon"
            />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Sign In
          </h2>
          <p className="text-blue-100 text-sm">
            Access your Inventory Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="">
          <div className="mb-4">
            <label className="block text-white font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/70 border border-white/40 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/70 border border-white/40 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-white text-indigo-600 font-semibold py-2 rounded-md shadow-lg hover:bg-blue-100 transition-transform transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-white/80 text-xs mt-6">
          © {new Date().getFullYear()} Inventory Management System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
