// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/contacts";

export const getAllContactQueries = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getAllQueries`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Contact Queries in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch All Contact Queries☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching All Contact Queries in BE (Request):",
        error.request
      );
      toast.error("Failed Fetch All Contact Queries☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteContactQuery = async (contactID) => {
  try {
    const response = axios.delete(`${BASE_API_URL}/deleteQuery/${contactID}`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting Contact Query in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Delete Contact Query☹️, Try Again Later!");
    } else {
      console.error(
        "Error Deleting Contact Query in BE (Request):",
        error.request
      );
      toast.error("Failed Delete Contact Query☹️, Try Again Later!");
    }
    return null;
  }
};
