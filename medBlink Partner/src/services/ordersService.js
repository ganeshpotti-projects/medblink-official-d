// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/orders";

export const getAllPartnerOrders = async (token) => {
  try {
    const response = axios.get(BASE_API_URL + "/getPartnerOrders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Partner Orders in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch All Partner Orders☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching All Partner Orders in BE (Request):",
        error.request
      );
      toast.error("Failed Fetch All Partner Orders☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateOrderStatus = async (updatedOrderDetails) => {
  try {
    const response = axios.patch(
      BASE_API_URL + "/updateOrderStatus",
      updatedOrderDetails
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error(
        "Error Updating Order Status by Partner in BE (Response):",
        {
          status: error.response.status,
          data: error.response.data,
        }
      );
      toast.error(
        "Failed to Update Order Status by Partner☹️, Try Again Later!"
      );
    } else {
      console.error(
        "Error Updating Order Status by Partner in BE(Request):",
        error.request
      );
      toast.error(
        "Failed to Update Order Status by Partner☹️, Try Again Later!"
      );
    }
    return null;
  }
};
