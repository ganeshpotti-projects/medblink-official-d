package com.medBlink.medBlinkAPI.events;

import com.medBlink.medBlinkAPI.io.OrderResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private String eventType; // {VERIFIED, UPDATED_STATUS, FB_SUBMITTED}
    private OrderResponse order;
}
