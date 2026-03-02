package com.medBlink.medBlinkAPI.events;

import com.medBlink.medBlinkAPI.io.PartnerOrderResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartnerOrderEvent {
    private String eventType; // {UPDATED_STATUS}
    private PartnerOrderResponse partnerOrder;
}
