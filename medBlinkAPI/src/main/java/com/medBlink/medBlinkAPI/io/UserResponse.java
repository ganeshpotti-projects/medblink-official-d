package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String userID;
    private String name;
    private String userImageUrl;
    private String email;
    private List<AddressDetail> savedAddresses;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private Double weight;
    private Double height;
}
