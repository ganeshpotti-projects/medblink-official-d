// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:30082/api/partners";

export const getPartner = async (partnerToken) => {
  try {
    const response = await axios.get(API_URL + "/getPartner", {
      headers: {
        Authorization: `Bearer ${partnerToken}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching Partner in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch Partner☹️, Try Again Later!");
    } else {
      console.error("Error Fetching Partner in BE (Request):", error.request);
      toast.error("Failed to Fetch Partner☹️, Try Again Later!");
    }
    return null;
  }
};

export const updatePartner = async (updatedData, partnerToken) => {
  try {
    const response = await axios.patch(
      API_URL + "/updatePartner",
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${partnerToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating Partner in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Update Partner☹️, Try Again Later!");
    } else {
      console.error("Error Updating Partner in BE (Request):", error.request);
      toast.error("Failed to Update Partner☹️, Try Again Later!");
    }
    return null;
  }
};

export const deletePartnerAccount = async (partnerToken) => {
  try {
    const response = await axios.delete(API_URL + "/deletePartner", {
      headers: {
        Authorization: `Bearer ${partnerToken}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting Partner in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Delete Partner☹️, Try Again Later!");
    } else {
      console.error(
        "Error Deleting Partner status in BE (Request):",
        error.request
      );
      toast.error("Failed to Delete Partner☹️, Try Again Later!");
    }
    return null;
  }
};
