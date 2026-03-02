// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/products/admin";

export const getProductsList = async () => {
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
      toast.error("Failed Fetch to All Products☹️, Try Again Later!");
    }
    return null;
  }
};

export const addProduct = async (product, productImage) => {
  const formData = new FormData();
  formData.append("productString", JSON.stringify(product));
  if (productImage) {
    formData.append("productImage", productImage);
  }

  try {
    const response = await axios.post(`${BASE_API_URL}/addProduct`, formData);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Saving Product in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Save Product☹️, Try Again Later!");
    } else {
      console.error("Error Saving Product in BE (Request):", error.request);
      toast.error("Failed to Save Product☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateProduct = async (product, productID, productImage) => {
  const formData = new FormData();
  formData.append("product", JSON.stringify(product));
  if (productImage) {
    formData.append("productImage", productImage);
  }

  try {
    const response = await axios.patch(
      `${BASE_API_URL}/updateProduct/${productID}`,
      formData
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating Product in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Update Product☹️, Try Again Later!");
    } else {
      console.error("Error Updating Product in BE (Request):", error.request);
      toast.error("Failed to Update Product☹️, Try Again Later!");
    }
    return null;
  }
};
