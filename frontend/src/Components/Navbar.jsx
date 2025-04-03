import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  return (
    <nav style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
      <Link to="/">Home</Link> | 
      <Link to="/cart"> Cart </Link> | 
      {user ? (
        <>
          {user.role === "admin" && <Link to="/admin"> Admin </Link>}
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | 
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
