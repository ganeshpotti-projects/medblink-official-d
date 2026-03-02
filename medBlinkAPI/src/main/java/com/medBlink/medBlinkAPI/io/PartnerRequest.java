package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartnerRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String password;
    private String address;
    private String city;
    private String zip;
    private String state;
    private String country;
    private String gender;
    private String dateOfBirth;
}
