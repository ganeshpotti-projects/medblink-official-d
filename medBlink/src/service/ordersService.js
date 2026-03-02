// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/orders";

export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/createOrder`,
      orderData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Creating Order in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Create Order☹️, Try Again Later!");
    } else {
      console.error("Error Creating Order in BE (Request):", error.request);
      toast.error("Failed to Create Order☹️, Try Again Later!");
    }
    return null;
  }
};

export const verifyPaymentOrder = async (paymentData, token) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/verifyOrder`,
      paymentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Verifying Order in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Verify Order☹️, Try Again Later!");
    } else {
      console.error("Error Verifying Order in BE (Request):", error.request);
      toast.error("Failed to Verify Order☹️, Try Again Later!");
    }
    return null;
  }
};

export const getOrders = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching Orders in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch Orders☹️, Try Again Later!");
    } else {
      console.error("Error Fetching Orders in BE (Request):", error.request);
      toast.error("Failed to Fetch Orders☹️, Try Again Later!");
    }
    return null;
  }
};

export const submitFeedback = async (orderID, feedbackData, token) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/submitFeedback/${orderID}`,
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Submitting Feedback in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Submit Feedback☹️, Try Again Later!");
    } else {
      console.error(
        "Error Submitting Feedback in BE (Request):",
        error.request
      );
      toast.error("Failed to Submit Feedback☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteOrder = async (orderID, deleteOrderReason, token) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}/deleteOrder/${orderID}?deleteOrderReason=${deleteOrderReason}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
      console.error("Error Deleting Order in BE (Request):", error.request);
      toast.error("Failed to Delete Order☹️, Try Again Later!");
    }
    return null;
  }
};

export const downloadInvoice = async (orderID, token) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/downloadInvoice/${orderID}`,
      {
        headers: { Authorization: `Bearer ${token}` },
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
