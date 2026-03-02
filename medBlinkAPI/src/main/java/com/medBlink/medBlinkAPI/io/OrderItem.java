package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String productID;
    private String batchID;
    private Double productPrice;
    private Integer productQuantity;
    private String productCategory;
    private String productName;
    private String productDescription;
    private String productImageUrl;
}
