package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.CartRequest;
import com.medBlink.medBlinkAPI.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);
    CartResponse getCart();
    void clearCart();
    CartResponse removeFromCart(CartRequest request);
    void confirmCartAfterPayment(String userID);
}