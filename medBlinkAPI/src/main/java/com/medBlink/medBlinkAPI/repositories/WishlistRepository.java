package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.WishlistEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<WishlistEntity, String> {
    Optional<WishlistEntity> findByWishlistIDAndUserID(String wishlistID, String userID);
    List<WishlistEntity> findByUserID(String userID);

}
