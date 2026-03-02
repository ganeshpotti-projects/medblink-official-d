// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/products";

export const getAllProductsList = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getAllProducts`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Products in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch All Products☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching All Products in BE (Request):",
        error.request
      );
      toast.error("Failed to Fetch All Products☹️, Try Again Later!");
    }
    return null;
  }
};

export const getProduct = async (productID) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getProduct/${productID}`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching Product in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch Product☹️, Try Again Later!");
    } else {
      console.error("Error Fetching Product in BE (Request):", error.request);
      toast.error("Failed to Fetch Product☹️, Try Again Later!");
    }
    return null;
  }
};
