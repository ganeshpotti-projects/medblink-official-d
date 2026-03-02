// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/carts";

export const addQtyToCart = async (productID, token) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/addToCart`,
      { productID },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Adding Item to Cart in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        `Failed to Add Item into Cart☹️. ${error.response.data.message}, Try Again Later!`
      );
    } else {
      console.error(
        "Error Adding Item to Cart in BE (Request):",
        error.request
      );
      toast.error("Failed to Add Item into Cart☹️, Try Again Later!");
    }
    return null;
  }
};

export const removeQtyFromCart = async (productID, token, quantity = 1) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/removeFromCart`,
      { productID, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error(
        "Error Removing Item/s from Cart (Response):",
        error.response.data
      );
      toast.error("Failed to Remove Item/s from Cart☹️");
    } else {
      console.error(
        "Error Removing Item/s from Cart (Request):",
        error.request
      );
      toast.error("Failed to Remove Item/s from Cart☹️");
    }
    return null;
  }
};

export const getCartData = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getCart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    if (error.response) {
      const notFound = "Cart Not Found";
      const errMsg = error?.response?.data?.message || "";
      const verify = notFound.toLowerCase() === errMsg.toLowerCase();

      if (!verify) {
        console.error("Error Fetching Items from Cart in BE (Response):", {
          status: error.response.status,
          data: error.response.data,
        });
        toast.error("Failed to Fetch Items from Cart☹️, Try Again Later!");
      }
    } else {
      console.error(
        "Error Fetching Items from Cart in BE (Request):",
        error.request
      );
      toast.error("Failed to Fetch Items from Cart☹️, Try Again Later!");
    }
    return null;
  }
};

export const clearCart = async (token) => {
  try {
    const response = await axios.delete(`${BASE_API_URL}/clearCart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Clearing Items from Cart in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error(
        "Error Clearing Items from Cart in BE (Request):",
        error.request
      );
      toast.error("Failed to Clear Items from Cart☹️, Try Again Later!");
    }
    return null;
  }
};
