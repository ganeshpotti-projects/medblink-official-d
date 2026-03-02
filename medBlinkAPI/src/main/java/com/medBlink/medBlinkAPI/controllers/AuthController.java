package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.AuthenticationRequest;
import com.medBlink.medBlinkAPI.io.AuthenticationResponse;
import com.medBlink.medBlinkAPI.services.AppUserDetailsService;
import com.medBlink.medBlinkAPI.utils.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(value="/api/auth/")
@AllArgsConstructor
public class AuthController {

    private final AppUserDetailsService appUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping(value = "/loginUser")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest) {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        }catch (Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to Login User☹️, User not exists (or) Bad user credentials, Retry!");
        }
        final UserDetails userDetails = appUserDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(authenticationRequest.getEmail(), jwtToken);
    }
}
