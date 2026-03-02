package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactRequest {
    private String contactName;
    private String contactEmail;
    private String contactPhoneNumber;
    private String contactMessage;
}
