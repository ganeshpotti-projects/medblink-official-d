package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.BatchEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BatchRepository extends MongoRepository<BatchEntity, String> {
    List<BatchEntity> findAllByProductID(String productID);
}
