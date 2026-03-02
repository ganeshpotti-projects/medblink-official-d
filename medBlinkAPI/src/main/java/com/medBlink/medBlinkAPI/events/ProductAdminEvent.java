package com.medBlink.medBlinkAPI.events;

import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductAdminEvent {
    private String eventType;           // { "UPDATED"}
    private AdminProductResponse product;
}
