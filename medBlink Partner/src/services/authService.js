import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:30082/api/partners";

export const loginPartner = async (loginData) => {
  try {
    const response = await axios.post(
      API_URL + "/auth/loginPartner",
      loginData
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Logging In Partner in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Login Partner☹️, Try Again Later!");
    } else {
      console.error("Error Logging In Partner in BE (Request):", error.request);
      toast.error("Failed to Login Partner☹️, Try Again Later!");
    }
    return null;
  }
};

export const registerPartner = async (registerData) => {
  try {
    const response = await axios.post(
      API_URL + "/registerPartner",
      registerData
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Registering Partner in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Register Partner☹️, Try Again Later!");
    } else {
      console.error(
        "Error Registering Partner in BE (Request):",
        error.request
      );
      toast.error("Failed to Register Partner☹️, Try Again Later!");
    }
    return null;
  }
};
