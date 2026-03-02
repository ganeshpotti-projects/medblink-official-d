package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.ContactEntity;
import com.medBlink.medBlinkAPI.io.ContactRequest;
import com.medBlink.medBlinkAPI.io.ContactResponse;
import com.medBlink.medBlinkAPI.repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void addContactQuery(ContactRequest request) {
        ContactEntity newContactQuery = convertToEntity(request);
        contactRepository.save(newContactQuery);
    }

    @Override
    public List<ContactResponse>  getContactQueries() {
        List<ContactEntity> contactEntities = contactRepository.findAll();
        return contactEntities.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void deleteContactQuery(String contactID) {
        contactRepository.deleteById(contactID);
    }

    private ContactEntity convertToEntity(ContactRequest request){
        return ContactEntity.builder()
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhoneNumber(request.getContactPhoneNumber())
                .contactMessage(request.getContactMessage())
                .build();
    }

    private ContactResponse convertToResponse(ContactEntity entity){
        return ContactResponse.builder()
                .contactID(entity.getContactID())
                .contactName(entity.getContactName())
                .contactEmail(entity.getContactEmail())
                .contactPhoneNumber(entity.getContactPhoneNumber())
                .contactMessage(entity.getContactMessage())
                .build();
    }
}