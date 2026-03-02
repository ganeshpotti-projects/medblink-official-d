package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.WishlistEntity;
import com.medBlink.medBlinkAPI.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class DefaultServiceImpl implements DefaultService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Override
    public WishlistEntity createDefaultWishlist(String userID) {
        WishlistEntity defaultWishlist = WishlistEntity.builder()
                .userID(userID)
                .name("Default")
                .description("Made with love ❤️ by MedBlink Dev")
                .image(null)
                .createdOn(LocalDate.now().format(DateTimeFormatter.ISO_DATE))
                .build();

        return wishlistRepository.save(defaultWishlist);
    }
}
