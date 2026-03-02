package com.medBlink.medBlinkAPI.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medBlink.medBlinkAPI.io.AddressDetail;
import com.medBlink.medBlinkAPI.io.UserRequest;
import com.medBlink.medBlinkAPI.io.UserResponse;
import com.medBlink.medBlinkAPI.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping(value = "/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getUser")
    public UserResponse getUser()
    {
        return userService.getUser();
    }

    @PostMapping(value = "/registerUser")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
        return userService.registerUser(request);
    }

    @PatchMapping("/updateUser")
    public UserResponse updateUserDetails(@RequestPart("userString") String userString,
                                          @RequestPart(value = "userImage", required = false) MultipartFile file){
        ObjectMapper mapper = new ObjectMapper();
        UserRequest userRequest = null;
        try{
            userRequest = mapper.readValue(userString, UserRequest.class);
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format");
        }
        UserResponse userResponse = userService.updateUser(userRequest, file);
        return userResponse;
    }

    @DeleteMapping("/deleteUser")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserAccount()
    {
        userService.deleteUser();
    }

    @GetMapping("/getAllAddresses")
    public List<AddressDetail> getSavedAddresses() {
        return userService.getSavedAddresses();
    }

    @PostMapping("/addAddress")
    public String addAddress(@RequestBody AddressDetail address) {
        userService.addAddress(address);
        return "Address saved successfully";
    }

    @PatchMapping("/updateAddress/{addressID}")
    @ResponseStatus(HttpStatus.OK)
    public void updateAddress(@PathVariable String addressID, @RequestBody AddressDetail updated) {
        userService.updateAddress(addressID, updated);
    }

    @DeleteMapping("/deleteAddress/{addressID}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(@PathVariable String addressID) {
        userService.deleteAddress(addressID);
    }
}
