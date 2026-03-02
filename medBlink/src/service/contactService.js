// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

export const addContactQuery = async (contactData) => {
  try {
    const response = await axios.post(
      "http://localhost:30082/api/contacts/addQuery",
      contactData
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Sending Contact query in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Send Contact query☹️, Try Again Later!");
    } else {
      console.error(
        "Error Sending Contact query in BE (Request):",
        error.request
      );
      toast.error("Failed to Send Contact query☹️, Try Again Later!");
    }
    return null;
  }
};
