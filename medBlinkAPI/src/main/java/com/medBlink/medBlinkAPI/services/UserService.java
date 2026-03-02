package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.AddressDetail;
import com.medBlink.medBlinkAPI.io.UserRequest;
import com.medBlink.medBlinkAPI.io.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    // User Services
    UserResponse getUser();
    UserResponse registerUser(UserRequest request);
    UserResponse updateUser(UserRequest user, MultipartFile file);
    void deleteUser();

    // User Address Services
    List<AddressDetail> getSavedAddresses();
    void addAddress(AddressDetail address);
    void updateAddress(String addressID, AddressDetail updatedAddress);
    void deleteAddress(String addressID);

    // Extra Services
    String findByUserID();
    String uploadFile(MultipartFile file);
    boolean deleteFile(String fileName);
}
