import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Check if user is logged in

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
