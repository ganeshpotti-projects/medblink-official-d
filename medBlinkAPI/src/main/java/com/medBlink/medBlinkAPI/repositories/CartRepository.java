package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<CartEntity, String> {
    Optional<CartEntity> findByUserID(String UserID);
    void deleteByUserID(String userID);
    List<CartEntity> findByCreatedAtBefore(LocalDateTime cutoff);
}
