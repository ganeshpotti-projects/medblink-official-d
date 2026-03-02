package com.medBlink.medBlinkAPI.entities;

import com.medBlink.medBlinkAPI.io.OrderFeedback;
import com.medBlink.medBlinkAPI.io.OrderItem;
import com.medBlink.medBlinkAPI.io.PartnerDetails;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Document(collection = "orders")
public class OrderEntity {
    @Id
    private String orderID;
    private String userID;
    private String partnerID;
    private Instant orderedDate;
    private Instant deliveredDate;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItem> orderedItems;
    private String paymentStatus;
    private String razorpayOrderID;
    private String razorpayPaymentID;
    private String razorpaySignature;
    private String orderStatus;
    private OrderFeedback orderFeedback;
    private Boolean isOrderFeedBackReceived;
    private PartnerDetails partnerDetails;
    private Double subTotalAmount;
    private Double taxAmount;
    private Double shippingPrice;
    private Double roundOffAmount;
    private double grandTotalAmount;
}
