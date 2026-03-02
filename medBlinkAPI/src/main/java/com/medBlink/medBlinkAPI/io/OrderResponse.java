package com.medBlink.medBlinkAPI.io;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

@Data
@SuperBuilder
@Jacksonized
public class OrderResponse extends BaseOrderResponse {
    private String razorpayOrderID;
    private Boolean isOrderFeedbackReceived;
    private OrderFeedback orderFeedback;
    private PartnerDetails partnerDetails;
    private String orderedDate;
    private String deliveredDate;
}
