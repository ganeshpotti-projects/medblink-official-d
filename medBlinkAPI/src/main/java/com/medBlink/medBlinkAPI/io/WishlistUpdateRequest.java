package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistUpdateRequest {
    private String wishlistID;
    private String name;
    private String image;
}
