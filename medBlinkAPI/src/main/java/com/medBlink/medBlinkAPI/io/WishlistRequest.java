package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistRequest {
    String wishlistID;
    String name;
    String description;
}
