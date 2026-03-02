package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistItem {
    private String productID;
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private String addedOn;
}
