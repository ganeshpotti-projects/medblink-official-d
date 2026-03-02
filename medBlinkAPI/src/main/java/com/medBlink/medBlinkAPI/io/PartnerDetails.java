package com.medBlink.medBlinkAPI.io;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class PartnerDetails {
    private String name;
    private String phoneNumber;
    private String email;
    private Integer ordersDelivered=0;
}
