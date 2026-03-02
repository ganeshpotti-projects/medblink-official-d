package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.UserEntity;
import com.medBlink.medBlinkAPI.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@Service("appUserDetailsService")
@AllArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
               UserEntity existingUser = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not Exists☹️, Try Registering!"));
       return new User(existingUser.getEmail(), existingUser.getPassword(), Collections.emptyList());
    }
}
