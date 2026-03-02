package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private Double weight;
    private Double height;
}
