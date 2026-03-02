package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemEntity {
    private String productID;
    private String batchID;
    private Integer quantity;
    private Double marketPrice;
    private Double sellingPrice;
    private String pack;
    private Integer gst;
}

