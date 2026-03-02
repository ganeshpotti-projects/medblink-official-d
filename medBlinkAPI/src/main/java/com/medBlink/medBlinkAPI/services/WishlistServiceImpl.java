package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.entities.WishlistEntity;
import com.medBlink.medBlinkAPI.entities.WishlistItem;
import com.medBlink.medBlinkAPI.io.WishlistRequest;
import com.medBlink.medBlinkAPI.io.WishlistResponse;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import com.medBlink.medBlinkAPI.repositories.UserRepository;
import com.medBlink.medBlinkAPI.repositories.WishlistRepository;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WishlistServiceImpl implements WishlistService {
    @Autowired
    private S3Client s3Client;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<WishlistResponse> getAllWishlists() {
        String userID = userService.findByUserID();
        List<WishlistEntity> wishlists = wishlistRepository.findByUserID(userID);

        return wishlists.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public WishlistResponse getWishlist(String wishlistID){
        WishlistEntity wishlist = wishlistRepository.findById(wishlistID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found"));
        return convertToResponse(wishlist);
    }

    @Override
    public WishlistResponse createWishlist(WishlistRequest request, MultipartFile file){
        String userID = userService.findByUserID();
        WishlistEntity wishlist = convertToEntity(request, userID);
        if(file!=null && !file.isEmpty())
        {
            String imageUrl = uploadFile(file);
            wishlist.setImage(imageUrl);
        }
        wishlist = wishlistRepository.save(wishlist);
        return convertToResponse(wishlist);
    }

    @Override
    public WishlistResponse updateWishList( WishlistRequest request, MultipartFile file){
        WishlistEntity wishlist = wishlistRepository.findById(request.getWishlistID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found"));

        if(request.getName()!=null)
        {
            wishlist.setName(request.getName());
        }
        if(request.getDescription()!=null)
        {
            wishlist.setDescription(request.getDescription());
        }
        if(file!=null && !file.isEmpty())
        {
            String imageUrl = uploadFile(file);
            wishlist.setImage(imageUrl);
        }
        wishlist = wishlistRepository.save(wishlist);
        return convertToResponse(wishlist);
    }

    @Override
    public void deleteWishList(String wishlistID) {
        WishlistEntity wishlist = wishlistRepository.findById(wishlistID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found"));
        if (wishlist.getImage() != null && !wishlist.getImage().isEmpty()) {
            String fileName = wishlist.getImage().substring(wishlist.getImage().lastIndexOf("/") + 1);
            deleteFile(fileName);
        }
        wishlistRepository.delete(wishlist);
    }

    @Override
    public String uploadFile(MultipartFile file){
        String fileNameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+fileNameExtension;
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket("medblink-wishlist")
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse putObjectResponse = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            if(putObjectResponse.sdkHttpResponse().isSuccessful()){
                return "https://medblink-wishlist.s3.amazonaws.com/"+key;
            }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload Failed");
            }
        }catch(IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred while uploading file");
        }
    }

    @Override
    public boolean deleteFile(String fileName){
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket("medblink-wishlist")
                .key(fileName)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    @Override
    public void addProductIntoWishlist(String wishlistID, String productID){
        WishlistEntity wishlist = wishlistRepository.findById(wishlistID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found"));
        if(wishlist.getItems().size()>20)
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't Add more than 20 Products");
        }
        ProductEntity productEntity = productRepository.findById(productID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        WishlistItem newItem = new WishlistItem(productID, productEntity.getProductName(), productEntity.getProductDescription(), productEntity.getProductImageUrl(), LocalDate.now().toString());
        wishlist.getItems().add(newItem);
        wishlistRepository.save(wishlist);
    }

    @Override
    public void removeProductFromWishlist(String wishlistID, String productID){
        WishlistEntity wishlist = wishlistRepository.findById(wishlistID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found"));
        wishlist.getItems().removeIf(item -> item.getProductID().equals(productID));
        wishlistRepository.save(wishlist);
    }

    private WishlistEntity convertToEntity(WishlistRequest request, String userID){
        return WishlistEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image("")
                .userID(userID)
                .items(new ArrayList<>())
                .createdOn(LocalDate.now().format(DateTimeFormatter.ISO_DATE))
                .build();
    }

    private WishlistResponse convertToResponse(WishlistEntity entity)
    {
        return WishlistResponse.builder()
                .wishlistID(entity.getWishlistID())
                .name(entity.getName())
                .description(entity.getDescription())
                .image(entity.getImage())
                .items(entity.getItems())
                .createdOn(entity.getCreatedOn())
                .build();
    }
}