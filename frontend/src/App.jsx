import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import ProductDetail from "./Pages/ProductDetail";
import AdminDashboard from "./Pages/AdminDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/Navbar"; // ✅ Import Navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar added here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<PrivateRoute />}>
          <Route index element={<Cart />} />
        </Route>
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
