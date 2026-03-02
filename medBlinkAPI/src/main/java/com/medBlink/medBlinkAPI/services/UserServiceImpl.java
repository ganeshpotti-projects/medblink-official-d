package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.UserEntity;
import com.medBlink.medBlinkAPI.io.AddressDetail;
import com.medBlink.medBlinkAPI.io.UserRequest;
import com.medBlink.medBlinkAPI.io.UserResponse;
import com.medBlink.medBlinkAPI.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;
    private final DefaultService defaultService;
    private final S3Client s3Client;

    @Override
    public UserResponse registerUser(UserRequest request) {
        Optional<UserEntity> userExists = userRepository.findByEmail(request.getEmail());
        if (userExists.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User already exists🙃. Try logging in (or) register with another email!"
            );
        }

        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        defaultService.createDefaultWishlist(newUser.getUserID());
        return convertToResponse(newUser);
    }

    @Override
    public String findByUserID() {
        String loggedInUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser =  userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedInUser.getUserID();
    }

    @Override
    public UserResponse getUser()
    {
        String email = authenticationFacade.getAuthentication().getName();
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Failed to Fetch User☹️, User not exists!"));
        return convertToResponse(existingUser);
    }

    @Override
    public UserResponse updateUser(UserRequest request, MultipartFile file)
    {
        String email = authenticationFacade.getAuthentication().getName();
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to Update Profile☹️, User not exists!"));
        if (request.getName() != null) {
            existingUser.setName(request.getName());
        }
        if (request.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getGender() != null) {
            existingUser.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getWeight() != null) {
            existingUser.setWeight(request.getWeight());
        }
        if (request.getHeight() != null) {
            existingUser.setHeight(request.getHeight());
        }
        if (file != null && !file.isEmpty()) {
            String oldImageUrl = existingUser.getUserImageUrl();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldFileName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                deleteFile(oldFileName);
            }
            String newImageUrl = uploadFile(file);
            existingUser.setUserImageUrl(newImageUrl);
        }
        userRepository.save(existingUser);
        return convertToResponse(existingUser);
    }

    @Override
    public String uploadFile(MultipartFile file) {
        String fileNameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+fileNameExtension;
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket("medblink-user")
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse putObjectResponse = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            if(putObjectResponse.sdkHttpResponse().isSuccessful()){
                return "https://medblink-user.s3.amazonaws.com/"+key;
            }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload Failed");
            }
        }catch(IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred while uploading file");
        }
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

    @Override
    public void deleteUser(){
        String email = authenticationFacade.getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to Delete Profile☹️, User not exists!"));
        userRepository.delete(user);
    }

    @Override
    public void addAddress(AddressDetail address) {
        String loggedInEmail = authenticationFacade.getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (address.getAddressID() == null || address.getAddressID().isEmpty()) {
            address.setAddressID(UUID.randomUUID().toString());
        }

        if (user.getSavedAddresses() == null) {
            user.setSavedAddresses(new java.util.ArrayList<>());
        }

        if (address.getIsDefault()) {
            user.getSavedAddresses().forEach(a -> a.setIsDefault(false));
        }

        user.getSavedAddresses().add(address);
        userRepository.save(user);
    }

    @Override
    public void updateAddress(String addressID, AddressDetail updatedAddress) {
        String email = authenticationFacade.getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getSavedAddresses() == null) {
            throw new IllegalStateException("No addresses found for this user.");
        }

        AddressDetail existing = user.getSavedAddresses().stream()
                .filter(addr -> addr.getAddressID() != null && addr.getAddressID().equals(addressID))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        existing.setFullName(updatedAddress.getFullName());
        existing.setEmail(updatedAddress.getEmail());
        existing.setPhoneNumber(updatedAddress.getPhoneNumber());
        existing.setAddress(updatedAddress.getAddress());
        existing.setCity(updatedAddress.getCity());
        existing.setState(updatedAddress.getState());
        existing.setZip(updatedAddress.getZip());
        existing.setIsDefault(updatedAddress.getIsDefault());

        if (updatedAddress.getIsDefault()) {
            user.getSavedAddresses().forEach(addr -> {
                if (addr.getAddressID() != null && !addr.getAddressID().equals(existing.getAddressID())) {
                    addr.setIsDefault(false);
                }
            });
        }
        userRepository.save(user);
    }

    @Override
    public List<AddressDetail> getSavedAddresses() {
        String email = authenticationFacade.getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getSavedAddresses();
    }

    @Override
    public void deleteAddress(String addressID) {
        String loggedInEmail = authenticationFacade.getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getSavedAddresses() == null || user.getSavedAddresses().isEmpty()) {
            throw new IllegalStateException("No addresses to delete.");
        }

        boolean removed = user.getSavedAddresses().removeIf(
                address -> address.getAddressID() != null && address.getAddressID().equals(addressID)
        );

        if (!removed) {
            throw new IllegalArgumentException("Address not found.");
        }

        userRepository.save(user);
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser) {
        return UserResponse.builder()
                .userID(registeredUser.getUserID())
                .name(registeredUser.getName())
                .userImageUrl(registeredUser.getUserImageUrl())
                .email(registeredUser.getEmail())
                .savedAddresses(registeredUser.getSavedAddresses())
                .phoneNumber(registeredUser.getPhoneNumber())
                .dateOfBirth(registeredUser.getDateOfBirth())
                .gender(registeredUser.getGender())
                .height(registeredUser.getHeight())
                .weight(registeredUser.getWeight())
                .build();
    }
}