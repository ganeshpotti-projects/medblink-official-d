package com.medBlink.medBlinkAPI.io;

import lombok.*;

@Getter
@AllArgsConstructor
public class PartnerAuthenticationResponse {
    private String email;
    private String token;
}
