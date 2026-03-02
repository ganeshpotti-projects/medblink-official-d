package com.medBlink.medBlinkAPI.repositories;

import com.medBlink.medBlinkAPI.entities.ContactEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends MongoRepository<ContactEntity, String> {
}
