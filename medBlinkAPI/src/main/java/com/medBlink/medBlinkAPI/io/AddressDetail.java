package com.medBlink.medBlinkAPI.io;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AddressDetail {
    private String addressID = UUID.randomUUID().toString();
    private String fullName;
    private String phoneNumber;
    private String email;
    private String address;
    private String city;
    private String state;
    private String zip;
    private Boolean isDefault;
}
