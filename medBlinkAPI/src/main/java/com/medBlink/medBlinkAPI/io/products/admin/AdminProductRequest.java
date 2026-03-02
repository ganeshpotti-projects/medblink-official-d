package com.medBlink.medBlinkAPI.io.products.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProductRequest {
    private String productName;
    private String productDescription;
    private String productCategory;
    private String productManufacturer;
}
