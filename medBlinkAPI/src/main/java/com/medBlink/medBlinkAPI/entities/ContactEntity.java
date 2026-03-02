package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "contacts")
public class ContactEntity {
    @Id
    private String contactID;
    private String contactName;
    private String contactEmail;
    private String contactPhoneNumber;
    private String contactMessage;
}
