package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchRequest {
    private String productID;
    private String batchNumber;
    private String manufacturedDate;
    private String expiryDate;
    private String pack;
    private Integer purchasedQuantity;
    private Double costPrice;
    private Double sellingPrice;
    private Double marketPrice;
    private String hsnCode;
    private Integer gst;
}
