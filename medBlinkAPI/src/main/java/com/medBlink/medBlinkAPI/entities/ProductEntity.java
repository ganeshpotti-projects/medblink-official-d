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
@Document(collection = "products")
public class ProductEntity {
    @Id
    private String productID;
    private String productName;
    private String productDescription;
    private String productCategory;
    private String productManufacturer;
    private String productImageUrl;
    // Initialize with 0
    private Integer totalAvailableQuantity=0;
    // Initialize with 0
    private Integer totalSoldQuantity=0;
    private Double productMarketPrice=0.0;
    private Double productSellingPrice=0.0;
    private String batchesStatus = "NOT_AVAILABLE"; // {NOT_AVAILABLE, AVAILABLE, UN_AVAILABLE}
}
