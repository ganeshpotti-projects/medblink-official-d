package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "batches")
public class BatchEntity {
    @Id
    private String batchID;
    private String productID;
    private String batchNumber;
    private String status="AVAILABLE"; // {AVAILABLE, NOT_AVAILABLE}
    private String manufacturedDate;
    private String expiryDate;
    private String pack;
    private Integer purchasedQuantity;
    private Integer availableQuantity;
    private Integer blockedQuantity;
    private Integer soldQuantity;
    private Double costPrice;
    private Double sellingPrice;
    private Double marketPrice;
    private String hsnCode;
    private Integer gst;
}
