package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponse {
    private String productID;
    private String batchID;
    private Integer quantity;
    private Double marketPrice;
    private Double sellingPrice;
    private String pack;
    private Integer gst;
}
