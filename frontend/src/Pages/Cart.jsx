import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const updateQuantity = (id, change) => {
    let updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    let updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const checkout = () => {
    localStorage.removeItem("cart");
    alert("Order Placed Successfully!");
    navigate("/");
  };

  if (cart.length === 0) return <h2>Your Cart is Empty</h2>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = total * 0.18;
  const grandTotal = total + gst;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item._id}>
          <img src={item.image} alt={item.name} width="50" />
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          <button onClick={() => updateQuantity(item._id, -1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item._id, 1)}>+</button>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Subtotal: ${total.toFixed(2)}</h3>
      <h3>GST (18%): ${gst.toFixed(2)}</h3>
      <h2>Grand Total: ${grandTotal.toFixed(2)}</h2>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
};

export default Cart;
