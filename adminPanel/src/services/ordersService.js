// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/orders";

export const getAllOrders = async () => {
  try {
    const response = axios.get(`${BASE_API_URL}/getAllOrders`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Orders in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch All Orders☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching All Orders in BE (Request):",
        error.request
      );
      toast.error("Failed Fetch All Orders☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateOrderStatus = async (updatedOrderDetails) => {
  try {
    const response = await axios.patch(
      `${BASE_API_URL}/updateOrderStatus`,
      updatedOrderDetails
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating Order status in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Update Order status☹️, Try Again Later!");
    } else {
      console.error(
        "Error Updating Order status in BE (Request):",
        error.request
      );
      toast.error("Failed Update Order status☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteOrder = async (orderID, deleteOrderReason) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}/deleteOrder/${orderID}?deleteOrderReason=${deleteOrderReason}`
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting Order in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Delete Order☹️, Try Again Later!");
    } else {
      console.error("Error Deleteing Order in BE (Request):", error.request);
      toast.error("Failed Delete Order☹️, Try Again Later!");
    }
    return null;
  }
};

export const downloadInvoice = async (orderID) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/downloadInvoice/${orderID}`,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_${orderID}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Downloading Invoice in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Download Invoice☹️, Try Again Later!");
    } else {
      console.error(
        "Error Downloading Invoice in BE (Request):",
        error.request
      );
      toast.error("Failed to Download Invoice☹️, Try Again Later!");
    }
    return null;
  }
};
