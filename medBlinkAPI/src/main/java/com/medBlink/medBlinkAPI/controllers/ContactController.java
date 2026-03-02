package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.ContactRequest;
import com.medBlink.medBlinkAPI.io.ContactResponse;
import com.medBlink.medBlinkAPI.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @GetMapping(value = "/getAllQueries")
    public List<ContactResponse> getContactQueries() {
        return contactService.getContactQueries();
    }

    @PostMapping(value = "/addQuery")
    @ResponseStatus(HttpStatus.CREATED)
    public void addContact(@RequestBody ContactRequest request)
    {
        contactService.addContactQuery(request);
    }

    @DeleteMapping(value = "/deleteQuery/{contactID}")
    public void deleteContactQuery(@PathVariable("contactID") String contactID) {
        contactService.deleteContactQuery(contactID);
    }
}
