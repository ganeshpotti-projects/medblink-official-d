package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private String contactID;
    private String contactName;
    private String contactEmail;
    private String contactPhoneNumber;
    private String contactMessage;
}
