package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.ProductEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<ProductEntity, String> {
}
