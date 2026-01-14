import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null); // null = still checking

  useEffect(() => {
    (async () => {
      const result = await isLoggedIn(true); // Check login status
      setIsAuth(result); // true or false
    })();
  }, []);

  // Show a loader while checking authentication
  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  // Not logged in → redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render nested route (e.g., /home)
  return <Outlet />;
};

export default ProtectedRoute;