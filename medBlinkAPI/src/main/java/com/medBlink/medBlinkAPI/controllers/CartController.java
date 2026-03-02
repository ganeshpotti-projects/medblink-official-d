package com.medBlink.medBlinkAPI.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.medBlink.medBlinkAPI.io.CartRequest;
import com.medBlink.medBlinkAPI.io.CartResponse;
import com.medBlink.medBlinkAPI.services.CartService;

@RestController
@RequestMapping(value = "/api/carts")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping(value = "/getCart")
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping(value = "/addToCart")
    public CartResponse addToCart(@RequestBody CartRequest request) {
        String productID = request.getProductID();
        if(productID == null || productID.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found with productID: "+productID);
        }
        return cartService.addToCart(request);
    }

    @PostMapping(value = "/removeFromCart")
    public CartResponse removeFromCart(@RequestBody CartRequest request) {
        String productID = request.getProductID();
        if (productID == null || productID.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found with productID: "+productID);
        }
        return cartService.removeFromCart(request);
    }

    @DeleteMapping(value="/clearCart")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }
}
