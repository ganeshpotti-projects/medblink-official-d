package com.medBlink.medBlinkAPI.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medBlink.medBlinkAPI.io.WishlistRequest;
import com.medBlink.medBlinkAPI.io.WishlistResponse;
import com.medBlink.medBlinkAPI.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping(value = "/api/wishlists")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping(value = "/getAllWishlists")
    public List<WishlistResponse> getUserWishlists()
    {
        return wishlistService.getAllWishlists();
    }

    @GetMapping(value = "/getWishlist/{wishlistID}")
    public WishlistResponse getWishlist(@PathVariable String wishlistID)
    {
        return wishlistService.getWishlist(wishlistID);
    }

    @PostMapping(value = "/createWishlist")
    public WishlistResponse createWishlist(@RequestPart String wishlistString, @RequestPart(value = "image", required = false) MultipartFile file){
        ObjectMapper mapper = new ObjectMapper();
        WishlistRequest request = null;
        try{
            request = mapper.readValue(wishlistString, WishlistRequest.class);
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format");
        }
        return wishlistService.createWishlist(request, file);
    }

    @PatchMapping(value = "/updateWishlist")
    public WishlistResponse updateWishlist(@RequestPart String wishlistString, @RequestPart(value = "image", required = false) MultipartFile file){
        ObjectMapper mapper = new ObjectMapper();
        WishlistRequest request = null;
        try{
            request = mapper.readValue(wishlistString, WishlistRequest.class);
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format");
        }
        return wishlistService.updateWishList(request, file);
    }

    @DeleteMapping(value = "/deleteWishlist/{wishlistID}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWishlist(@PathVariable String wishlistID){
        wishlistService.deleteWishList(wishlistID);
    }

    @PostMapping(value = "/addProductIntoWishlist/{wishlistID}")
    public void addProductIntoWishlist(@PathVariable String wishlistID, @RequestParam String productID)
    {
        wishlistService.addProductIntoWishlist(wishlistID,productID);
    }

    @DeleteMapping(value = "/removeProductFromWishlist/{wishlistID}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeProductFromWishlist(@PathVariable String wishlistID, @RequestParam String productID)
    {
        wishlistService.removeProductFromWishlist(wishlistID,productID);
    }
}
