import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productSlice = createSlice({
  name: "products",
  initialState: { products: [] },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;

export const fetchProducts = () => async (dispatch) => {
  const { data } = await axios.get("http://localhost:5000/api/products");
  dispatch(setProducts(data));
};

export default productSlice.reducer;
