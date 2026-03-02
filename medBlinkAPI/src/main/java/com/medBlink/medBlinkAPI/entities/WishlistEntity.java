package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "wishlists")
public class WishlistEntity {
    @Id
    private String wishlistID;
    private String name;
    private String description;
    private String image;
    private String userID;
    private String createdOn;
    private List<WishlistItem> items = new ArrayList<>();
}
