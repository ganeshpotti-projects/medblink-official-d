package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.PartnerEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerRepository extends MongoRepository<PartnerEntity, String> {
    Optional<PartnerEntity> findByEmail(String email);
    List<PartnerEntity> findByStatus(String status);
}
