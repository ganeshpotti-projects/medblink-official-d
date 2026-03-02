package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "partners")
public class PartnerEntity {
    @Id
    private String partnerID;
    private String name;
    private String phoneNumber;
    private String email;
    private String password;
    private String address;
    private String city;
    private String zip;
    private String state;
    private String country;
    private String status;
    private LocalDateTime registeredDate;
    private LocalDateTime approvedDate;
    private Boolean isApprovedPartner;
    private String gender;
    private String dateOfBirth;
    private Integer ordersDelivered=0;
    private BlinkPoints blinkPoints;
    private PartnerIncome partnerIncome;
}
