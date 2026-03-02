package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductRequest;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<AdminProductResponse> readProductsForAdmin();
    List<UserProductResponse> readProductsForUser();
    AdminProductResponse readProductForAdmin(String productID);
    UserProductResponse readProductForUser(String productID);
    String uploadFile(MultipartFile file);
    AdminProductResponse addProduct(AdminProductRequest request, MultipartFile file);
    AdminProductResponse updateProduct(AdminProductRequest request, String productID, MultipartFile file);
    boolean deleteFile(String FileName);
    void deleteProduct(String productID);
    // EXTERNAL
    AdminProductResponse getUpdatedAdminProductResponse(ProductEntity entity);
    UserProductResponse getUpdatedUserProductResponse(ProductEntity entity);
}
