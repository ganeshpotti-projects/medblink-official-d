package com.medBlink.medBlinkAPI.io;

import com.medBlink.medBlinkAPI.entities.WishlistItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishlistResponse {
    private String wishlistID;
    private String name;
    private String description;
    private String image;
    private String createdOn;
    private List<WishlistItem> items = new ArrayList<>();
}
