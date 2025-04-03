import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { fetchProducts } from "../redux/productSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product._id} style={{ border: "1px solid #ddd", padding: "10px" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%" }} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <Link to={`/product/${product._id}`}>View Details</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
