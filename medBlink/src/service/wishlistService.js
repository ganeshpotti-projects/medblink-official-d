// THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API_URL = "http://localhost:30082/api/wishlists";

export const createWishlist = async (token, wishlistData, image) => {
  try {
    const formData = new FormData();
    formData.append("wishlistString", JSON.stringify(wishlistData));
    if (image) {
      formData.append("image", image);
    }
    const response = await axios.post(
      `${BASE_API_URL}/createWishlist`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error creating Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Create Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error("Error Creating Wishlist in BE (Request):", error.request);
      toast.error("Failed to Create Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};

export const updateWishlist = async (token, wishlistData, image) => {
  try {
    const formData = new FormData();
    formData.append("wishlistString", JSON.stringify(wishlistData));
    if (image) {
      formData.append("image", image);
    }
    const response = await axios.patch(
      `${BASE_API_URL}/updateWishlist`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error updating Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Update Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error("Error Updating Wishlist in BE (Request):", error.request);
      toast.error("Failed to Update Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};

export const deleteWishlist = async (token, wishlistID) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}/deleteWishlist/${wishlistID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Deleting Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Delete Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error("Error Deleting Wishlist in BE (Request):", error.request);
      toast.error("Failed to Delete Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};

export const getAllWishlists = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getAllWishlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching Wishlists in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Fetch Wishlists☹️, Try Again Later!"
      );
    } else {
      console.error("Error Fetching Wishlists in BE (Request):", error.request);
      toast.error("Failed to Fetch Wishlists☹️, Try Again Later!");
    }
    return null;
  }
};

export const getWishlist = async (token, wishlistID) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/getWishlist/${wishlistID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error Fetching Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Fetch Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error("Error Fetching Wishlist in BE (Request):", error.request);
      toast.error("Failed to Fetch Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};

export const addProductIntoWishlist = async (token, wishlistID, productID) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/addProductIntoWishlist/${wishlistID}?productID=${productID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Adding Product into Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Add Product into Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error(
        "Error Adding Product into Wishlist in BE (Request):",
        error.request
      );
      toast.error("Failed to Add Product into Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};

export const removeProductFromWishlist = async (
  token,
  wishlistID,
  productID
) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}/removeProductFromWishlist/${wishlistID}?productID=${productID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error Removing Product from Wishlist in BE (Response):", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(
        error.response.data.message ||
          "Failed to Remove Product from Wishlist☹️, Try Again Later!"
      );
    } else {
      console.error(
        "Error Removing Product from Wishlist in BE (Request):",
        error.request
      );
      toast.error("Failed to Remove Product from Wishlist☹️, Try Again Later!");
    }
    return null;
  }
};
