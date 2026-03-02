// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/users";

export const getUser = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching User in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Fetch Profile☹️, Try Again Later!"
      );
    } else {
      console.error("Error Fetching User in BE (Request):", error.request);
      toast.error("Failed to Fetch Profile☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateUser = async (token, userData, userImage) => {
  try {
    const formData = new FormData();
    formData.append("userString", JSON.stringify(userData));

    if (userImage) {
      formData.append("userImage", userImage);
    }

    const response = await axios.patch(`${BASE_API_URL}/updateUser`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating User in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Update Profile☹️, Try Again Later!"
      );
    } else {
      console.error("Error Updating User in BE (Request):", error.request);
      toast.error("Failed to Update Profile☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteAccount = async (token) => {
  try {
    const response = await axios.delete(`${BASE_API_URL}/deleteUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting User in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Delete Profile☹️, Try Again Later!"
      );
    } else {
      console.error("Error Deleting User in BE (Request):", error.request);
      toast.error("Failed to Delete Profile☹️, Try Again Later!");
    }
    return null;
  }
};

export const getAllAddresses = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getAllAddresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching User Addresses in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Fetch User Addresses☹️, Try Again Later!");
    } else {
      console.error(
        "Error Fetching User Addresses in BE (Request):",
        error.request
      );
      toast.error("Failed to Fetch User Addresses☹️, Try Again Later!");
    }
    return null;
  }
};

export const addAddress = async (token, addressDetail) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/addAddress`,
      addressDetail,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Saving User Address in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Save User Address☹️, Try Again Later!");
    } else {
      console.error(
        "Error Saving User Address in BE (Request):",
        error.request
      );
      toast.error("Failed to Save User Address☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateAddress = async (token, addressID, data) => {
  try {
    const response = await axios.patch(
      `${BASE_API_URL}/updateAddress/${addressID}`,
      {
        ...data,
        default: data.isDefault,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Updating User Address in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Update User Address☹️, Try Again Later!");
    } else {
      console.error(
        "Error Updating User Address in BE (Request):",
        error.request
      );
      toast.error("Failed to Update User Address☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteAddress = async (token, addressID) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}/deleteAddress/${addressID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting User Address in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error("Failed to Delete User Address☹️, Try Again Later!");
    } else {
      console.error(
        "Error Deleting User Address in BE (Request):",
        error.request
      );
      toast.error("Failed to Delete User Address☹️, Try Again Later!");
    }
    return null;
  }
};
