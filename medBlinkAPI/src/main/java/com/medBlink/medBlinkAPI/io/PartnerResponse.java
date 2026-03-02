package com.medBlink.medBlinkAPI.io;

import com.medBlink.medBlinkAPI.entities.BlinkPoints;
import com.medBlink.medBlinkAPI.entities.PartnerIncome;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartnerResponse {
    private String partnerID;
    private String name;
    private String phoneNumber;
    private String email;
    private String address;
    private String city;
    private String zip;
    private String state;
    private String country;
    private String status;
    private String registeredDate;
    private String approvedDate;
    private Boolean isApprovedPartner;
    private String gender;
    private String dateOfBirth;
    private Integer ordersDelivered;
    private BlinkPoints blinkPoints;
    private PartnerIncome partnerIncome;
}
