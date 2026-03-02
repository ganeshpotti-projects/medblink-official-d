package com.medBlink.medBlinkAPI.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductRequest;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping(value = "/api/products")
@AllArgsConstructor
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/getAllProducts")
    public List<UserProductResponse> getProductsForUser() {
        return productService.readProductsForUser();
    }

    @GetMapping(value = "/admin/getAllProducts")
    public List<AdminProductResponse> getProductsForAdmin() {
        return productService.readProductsForAdmin();
    }

    @GetMapping(value = "/getProduct/{productID}")
    public UserProductResponse getProduct(@PathVariable String productID) {
        return productService.readProductForUser(productID);
    }

    @GetMapping(value = "/admin/getProduct/{productID}")
    public AdminProductResponse getProductForAdmin(@PathVariable String productID) {
        return productService.readProductForAdmin(productID);
    }

    @PostMapping(value = "/admin/addProduct")
    public AdminProductResponse addProduct(@RequestPart("productString") String productString,
                                           @RequestPart(value = "productImage", required = false) MultipartFile file){
        ObjectMapper mapper = new ObjectMapper();
        AdminProductRequest adminProductRequest = null;
        try{
            adminProductRequest = mapper.readValue(productString, AdminProductRequest.class);
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format");
        }
        AdminProductResponse adminProductResponse = productService.addProduct(adminProductRequest, file);
        return adminProductResponse;
    }

    @PatchMapping(value = "/admin/updateProduct/{id}")
    public AdminProductResponse updateProduct(@PathVariable String id,
            @RequestPart("product") String productString,
                                      @RequestPart(value = "productImage", required = false) MultipartFile file){
        ObjectMapper mapper = new ObjectMapper();
        AdminProductRequest adminProductRequest = null;
        try{
            adminProductRequest = mapper.readValue(productString, AdminProductRequest.class);
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format");
        }
       return productService.updateProduct(adminProductRequest, id, file);
    }

    @DeleteMapping(value = "/admin/deleteProduct/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}
