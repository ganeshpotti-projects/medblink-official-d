package com.medBlink.medBlinkAPI.io.products.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminProductResponse {
    private String productID;
    private String productName;
    private String productDescription;
    private String productCategory;
    private String productManufacturer;
    private String productImageUrl;
    private Integer totalAvailableQuantity;
    private Integer totalSoldQuantity;
    private Double productMarketPrice;
    private Double productSellingPrice;
    private String batchesStatus;
}
