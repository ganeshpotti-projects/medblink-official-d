package com.medBlink.medBlinkAPI.events;

import com.medBlink.medBlinkAPI.io.PartnerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartnerEvent {
    private String eventType;     // {REGISTERED, UPDATED}
    private PartnerResponse response;
}
