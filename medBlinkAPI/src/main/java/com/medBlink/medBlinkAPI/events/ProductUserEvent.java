package com.medBlink.medBlinkAPI.events;

import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductUserEvent {
    private String eventType;           // {"CREATED", "UPDATED", "DELETED"}
    private UserProductResponse product;
}
