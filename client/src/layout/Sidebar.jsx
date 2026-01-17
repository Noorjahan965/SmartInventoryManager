import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ setLogoutPopup }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("Role") === "ADMIN";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

  const menuItem = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium tracking-wide transition 
     ${isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"}`;

  return (
    <aside className="h-full flex flex-col bg-slate-900 py-4 shadow-2xl">
      <ul className="flex-1 overflow-y-auto space-y-2 text-sm">
        <NavLink to="/home" className={menuItem}>🏠 Home</NavLink>
        <NavLink to="/view" className={menuItem}>📋 View</NavLink>
        <NavLink to="/stock-management" className={menuItem}>📦 Stocks</NavLink>
        <NavLink to="/add-stock" className={menuItem}>➕ Add Stock</NavLink>
        <NavLink to="/billing" className={menuItem}>📑 Billing</NavLink>
        <NavLink to="/product-management" className={menuItem}>🧰 Product Management</NavLink>

        {isAdmin && (
          <NavLink to="/admin-panel" className={menuItem}>🛡️ Admin Panel</NavLink>
        )}
      </ul>

      <button
        onClick={() => setLogoutPopup(true)}
        className="text-center bg-red-600 hover:bg-red-700 cursor-pointer transition py-2 font-semibold rounded-md mx-4 mb-4"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;