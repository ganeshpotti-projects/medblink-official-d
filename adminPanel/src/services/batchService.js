// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/batches";

export const addBatch = async (batchData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/addBatch`, batchData);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Saving Batch in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Save Batch☹️, Try Again Later!");
    } else {
      console.error("Error Saving Batch in BE (Request):", error.request);
      toast.error("Failed to Save Batch☹️, Try Again Later!");
    }
    return null;
  }
};

export const getAllBatches = async (productID) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/getAllBatches/${productID}`
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching All Batches in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      console.log();
      toast.error(
        `Failed to Fetch All Batches☹️, Try Again Later!\n\nReason: ${
          error.response?.data?.message || "Unknown error"
        }`,
        {
          style: { whiteSpace: "pre-line" },
        }
      );
    } else {
      console.error(
        "Error Fetching All Batches in BE (Request):",
        error.request
      );
      toast.error("Failed to Fetch All Batches☹️, Try Again Later!");
    }
    return null;
  }
};
