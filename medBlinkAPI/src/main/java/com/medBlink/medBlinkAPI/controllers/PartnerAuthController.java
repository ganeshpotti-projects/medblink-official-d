package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.PartnerAuthenticationRequest;
import com.medBlink.medBlinkAPI.io.PartnerAuthenticationResponse;
import com.medBlink.medBlinkAPI.services.AppPartnerDetailsService;
import com.medBlink.medBlinkAPI.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners/auth")
public class PartnerAuthController {

    private final AuthenticationManager partnerAuthenticationManager;
    private final AppPartnerDetailsService appPartnerDetailsService;
    private final JwtUtil jwtUtil;

    public PartnerAuthController(
            @Qualifier("partnerAuthenticationManager") AuthenticationManager partnerAuthenticationManager,
            AppPartnerDetailsService appPartnerDetailsService,
            JwtUtil jwtUtil
    ) {
        this.partnerAuthenticationManager = partnerAuthenticationManager;
        this.appPartnerDetailsService = appPartnerDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/loginPartner")
    public ResponseEntity<?> login(@RequestBody PartnerAuthenticationRequest partnerAuthenticationRequest) {
        try {
            partnerAuthenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            partnerAuthenticationRequest.getEmail(),
                            partnerAuthenticationRequest.getPassword()
                    )
            );

            UserDetails partnerDetails = appPartnerDetailsService
                    .loadUserByUsername(partnerAuthenticationRequest.getEmail());
            String jwtToken = jwtUtil.generateToken(partnerDetails);

            return ResponseEntity.ok(
                    new PartnerAuthenticationResponse(partnerAuthenticationRequest.getEmail(), jwtToken)
            );

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401)
                    .body("Invalid credentials or approval pending.");
        }
    }
}
