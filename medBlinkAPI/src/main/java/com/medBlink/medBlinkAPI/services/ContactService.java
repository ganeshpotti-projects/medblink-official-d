package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.ContactRequest;
import com.medBlink.medBlinkAPI.io.ContactResponse;

import java.util.List;

public interface ContactService {
    void addContactQuery(ContactRequest contactRequest);
    List<ContactResponse> getContactQueries();
    void deleteContactQuery(String contactID);
}
