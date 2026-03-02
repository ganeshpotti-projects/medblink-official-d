package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.events.ProductUserEvent;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductRequest;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.mappers.BatchMapper;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BatchMapper batchMapper;

    @Autowired
    private EventProducer eventProducer;

    @Override
    public String uploadFile(MultipartFile file) {
        String fileNameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+fileNameExtension;
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket("medblink-product")
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse putObjectResponse = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            if(putObjectResponse.sdkHttpResponse().isSuccessful()){
                return "https://medblink-product.s3.amazonaws.com/"+key;
            }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload Failed");
            }
        }catch(IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occured while uploading file");
        }
    }

    @Override
    public AdminProductResponse addProduct(AdminProductRequest request, MultipartFile file) {
        ProductEntity newProductEntity = convertToEntity(request);
        if (file != null && !file.isEmpty()) {
            String productImageUrl = uploadFile(file);
            newProductEntity.setProductImageUrl(productImageUrl);
        }
        newProductEntity = productRepository.save(newProductEntity);

        UserProductResponse productUserResponse = convertToUserResponse(newProductEntity);
        ProductUserEvent event = new ProductUserEvent("CREATED", productUserResponse);
        eventProducer.sendEvent("product-user-topic", event);

        AdminProductResponse adminProductResponse = convertToAdminResponse(newProductEntity);
        return adminProductResponse;
    }

    @Override
    public AdminProductResponse updateProduct(AdminProductRequest request, String productID, MultipartFile file){
        ProductEntity existingProduct = productRepository.findById(productID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (request.getProductName() != null) existingProduct.setProductName(request.getProductName());
        if (request.getProductDescription()!=null) existingProduct.setProductDescription(request.getProductDescription());
        if (request.getProductCategory()!=null) existingProduct.setProductCategory(request.getProductCategory());

        if (file != null && !file.isEmpty()) {
            String oldImageUrl = existingProduct.getProductImageUrl();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldFileName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                deleteFile(oldFileName);
            }
            String newImageUrl = uploadFile(file);
            existingProduct.setProductImageUrl(newImageUrl);
        }
        ProductEntity updatedEntity = productRepository.save(existingProduct);

        UserProductResponse userProductResponse = convertToUserResponse(updatedEntity);
        ProductUserEvent event = new ProductUserEvent("UPDATED", userProductResponse);
        eventProducer.sendEvent("product-user-topic", event);
        return convertToAdminResponse(updatedEntity);
    }

    @Override
    public AdminProductResponse getUpdatedAdminProductResponse(ProductEntity entity)
    {
        return convertToAdminResponse(entity);
    }

    @Override
    public UserProductResponse getUpdatedUserProductResponse(ProductEntity entity)
    {
        return convertToUserResponse(entity);
    }

    @Override
    public List<AdminProductResponse> readProductsForAdmin() {
        List<ProductEntity> productEntities = productRepository.findAll();
        return productEntities.stream().map(productEntity -> convertToAdminResponse(productEntity)).collect(Collectors.toList());
    }

    @Override
    public List<UserProductResponse> readProductsForUser() {
        List<ProductEntity> productEntities = productRepository.findAll();
        return productEntities.stream().map(productEntity -> convertToUserResponse(productEntity)).collect(Collectors.toList());
    }

    @Override
    public AdminProductResponse readProductForAdmin(String productID) {
        ProductEntity existingProduct = productRepository.findById(productID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product Not Found of id: "+productID));
        return convertToAdminResponse(existingProduct);
    }

    @Override
    public UserProductResponse readProductForUser(String productID) {
        ProductEntity existingProduct = productRepository.findById(productID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product Not Found of id: "+productID));
        return convertToUserResponse(existingProduct);
    }

    @Override
    public void deleteProduct(String productId) {
        UserProductResponse userProductResponse = readProductForUser(productId);

        String imageUrl = userProductResponse.getProductImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/")+1);
            deleteFile(fileName);
        }

        productRepository.deleteById(productId);

        ProductUserEvent event = new ProductUserEvent("DELETED", userProductResponse);
        eventProducer.sendEvent("product-user-topic", event);
    }

    @Override
    public boolean deleteFile(String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket("medblink-product")
                .key(fileName)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    private ProductEntity convertToEntity(AdminProductRequest request){
        return ProductEntity.builder()
                .productName(request.getProductName())
                .productDescription(request.getProductDescription())
                .productCategory(request.getProductCategory())
                .productManufacturer(request.getProductManufacturer())
                .totalAvailableQuantity(0)
                .totalSoldQuantity(0)
                .productMarketPrice(0.0)
                .productSellingPrice(0.0)
                .batchesStatus("NOT_AVAILABLE")
                .build();
    }

    private AdminProductResponse convertToAdminResponse(ProductEntity entity){
        return AdminProductResponse.builder()
                .productID(entity.getProductID())
                .productName(entity.getProductName())
                .productDescription(entity.getProductDescription())
                .productCategory(entity.getProductCategory())
                .productManufacturer(entity.getProductManufacturer())
                .productImageUrl(entity.getProductImageUrl())
                .totalAvailableQuantity(entity.getTotalAvailableQuantity())
                .totalSoldQuantity(entity.getTotalSoldQuantity())
                .productMarketPrice(entity.getProductMarketPrice())
                .productSellingPrice(entity.getProductSellingPrice())
                .batchesStatus(entity.getBatchesStatus())
                .build();
    }

    private UserProductResponse convertToUserResponse(ProductEntity entity){
        return UserProductResponse.builder()
                .productID(entity.getProductID())
                .productName(entity.getProductName())
                .productDescription(entity.getProductDescription())
                .productCategory(entity.getProductCategory())
                .productManufacturer(entity.getProductManufacturer())
                .productImageUrl(entity.getProductImageUrl())
                .totalAvailableQuantity(entity.getTotalAvailableQuantity())
                .totalSoldQuantity(entity.getTotalSoldQuantity())
                .productMarketPrice(entity.getProductMarketPrice())
                .productSellingPrice(entity.getProductSellingPrice())
                .batchesStatus(entity.getBatchesStatus())
                .build();
    }
}
