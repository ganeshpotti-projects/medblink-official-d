package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartEntity {
    @Id
    private String cartID;
    private String userID;
    private List<CartItemEntity> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean expired;
}
