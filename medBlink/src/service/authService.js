// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api";

export const registerUser = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/users/registerUser`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Registering User in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Register User☹️, Try Again Later!"
      );
    } else if (error.request) {
      console.error("Error Registering User in BE (Request):", error.request);
      toast.error("Failed to Register User☹️, Try Again Later!");
    }
    return null;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/loginUser`, data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Loggin In User in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Log In User☹️, Try Again Later!"
      );
    } else if (error.request) {
      console.error("Error Logging In User in BE (Request):", error.request);
      toast.error("Failed to Log In User☹️, Try Again Later!");
    }
    return null;
  }
};
