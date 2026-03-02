package com.medBlink.medBlinkAPI.io;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
public class BaseOrderResponse {
    private String orderID;
    private String userID;
    private String partnerID;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private Double grandTotalAmount;
    private String paymentStatus;
    private String orderStatus;
    private List<OrderItem> orderedItems;
}
