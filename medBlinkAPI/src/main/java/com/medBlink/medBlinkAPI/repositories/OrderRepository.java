package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUserID(String userID);
    Optional<OrderEntity> findByRazorpayOrderID(String razorpayOrderID);
    List<OrderEntity> findByPartnerID(String partnerID);
}
