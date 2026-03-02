package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchResponse {
    private String batchID;
    private String productID;
    private String batchNumber;
    private String status;
    private String manufacturedDate;
    private String expiryDate;
    private String pack;
    private Integer purchasedQuantity;
    private Integer availableQuantity;
    private Integer soldQuantity;
    private Double costPrice;
    private Double sellingPrice;
    private Double marketPrice;
    private String hsnCode;
    private Integer gst;
}
