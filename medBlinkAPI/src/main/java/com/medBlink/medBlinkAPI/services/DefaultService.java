package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.WishlistEntity;

public interface DefaultService  {
    WishlistEntity createDefaultWishlist(String userID);
}
