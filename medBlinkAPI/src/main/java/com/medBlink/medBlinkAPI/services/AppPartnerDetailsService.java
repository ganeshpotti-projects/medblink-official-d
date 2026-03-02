//package com.medBlink.medBlinkAPI.services;
//
//import com.medBlink.medBlinkAPI.entities.PartnerEntity;
//import com.medBlink.medBlinkAPI.repositories.PartnerRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//
//@Service("appPartnerDetailsService")
//@AllArgsConstructor
//public class AppPartnerDetailsService implements UserDetailsService {
//    private final PartnerRepository partnerRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
//        PartnerEntity existingPartner = partnerRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Partner not found"));
//        return new User(existingPartner.getEmail(), existingPartner.getPassword(), Collections.emptyList());
//    }
//}
package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.PartnerEntity;
import com.medBlink.medBlinkAPI.repositories.PartnerRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
@Service("appPartnerDetailsService")
@AllArgsConstructor
public class AppPartnerDetailsService implements UserDetailsService {

    private final PartnerRepository partnerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        PartnerEntity existingPartner = partnerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Partner not found"));

        if (!"Approved".equalsIgnoreCase(existingPartner.getStatus())) {
            throw new UsernameNotFoundException("Partner not approved");
        }

        return new User(existingPartner.getEmail(), existingPartner.getPassword(), Collections.emptyList());
    }
}

