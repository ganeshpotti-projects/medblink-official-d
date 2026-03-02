package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.WishlistRequest;
import com.medBlink.medBlinkAPI.io.WishlistResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WishlistService {
    List<WishlistResponse> getAllWishlists();
    WishlistResponse getWishlist(String wishlistID);
//    WishlistEntity createDefaultWishlist(String userID);
    WishlistResponse createWishlist(WishlistRequest request, MultipartFile file);
    WishlistResponse updateWishList( WishlistRequest request, MultipartFile file);
    void deleteWishList(String wishlistID);
    String uploadFile(MultipartFile file);
    boolean deleteFile(String FileName);
    void addProductIntoWishlist(String wishlistID, String productID);
    void removeProductFromWishlist(String wishlistID, String productID);
}
