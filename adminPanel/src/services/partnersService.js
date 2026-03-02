// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/partners";

export const getAllPartners = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getAllPartners`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Partners in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch All Partners☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching All Partners in BE (Request):",
        error.request
      );
      toast.error("Failed to Fetch All Partners☹️, Try Again Later!");
    }
    return null;
  }
};

export const updatePartnerStatus = async (partnerID, updatedStatus) => {
  try {
    const respose = axios.patch(
      `${BASE_API_URL}/updatePartnerStatus/${partnerID}?partnerStatus=${updatedStatus}`
    );
    return respose;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating Partner status in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Update Partner status☹️, Try Again Later!");
    } else {
      console.error(
        "Error Updating Partner status in BE (Request):",
        error.request
      );
      toast.error("Failed to Update Partner status☹️, Try Again Later!");
    }
    return null;
  }
};
