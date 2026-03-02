package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.CartEntity;
import com.medBlink.medBlinkAPI.entities.CartItemEntity;
import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.events.ProductAdminEvent;
import com.medBlink.medBlinkAPI.events.ProductUserEvent;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.BatchRepository;
import com.medBlink.medBlinkAPI.repositories.CartRepository;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartCleaner {

    private final CartRepository cartRepository;
    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final EventProducer eventProducer;

    public CartCleaner(CartRepository cartRepository, BatchRepository batchRepository, ProductRepository productRepository, ProductService productService, EventProducer eventProducer) {
        this.cartRepository = cartRepository;
        this.batchRepository = batchRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.eventProducer = eventProducer;
    }

    @Scheduled(fixedRate = 60000)
    public void cleanExpiredCarts() {
        LocalDateTime expiryThreshold = LocalDateTime.now().minusMinutes(10);
        List<CartEntity> expiredCarts = cartRepository.findByCreatedAtBefore(expiryThreshold);

        for (CartEntity cart : expiredCarts) {
            for (CartItemEntity item : cart.getItems()) {
                batchRepository.findById(item.getBatchID()).ifPresent(batch -> {
                    batch.setBlockedQuantity(batch.getBlockedQuantity() - item.getQuantity());
                    batch.setAvailableQuantity(batch.getAvailableQuantity() + item.getQuantity());
                    batchRepository.save(batch);
                    if (batch.getAvailableQuantity() > 0) {
                        batch.setStatus("AVAILABLE");
                    } else {
                        batch.setStatus("NOT_AVAILABLE");
                    }
                    batchRepository.save(batch);
                    String productID = batch.getProductID();
                    ProductEntity productEntity = productRepository.findById(productID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with productID: "+productID));
                    productEntity.setTotalAvailableQuantity(productEntity.getTotalAvailableQuantity() + item.getQuantity());
                    productRepository.save(productEntity);
                    if(productEntity.getTotalAvailableQuantity() > 0)
                    {
                        productEntity.setBatchesStatus("AVAILABLE");
                    }else{
                        productEntity.setBatchesStatus("UN_AVAILABLE");
                    }
                    productRepository.save(productEntity);
                    AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(productEntity);
                    ProductAdminEvent productAdminEvent = new ProductAdminEvent("UPDATED", adminProductResponse);
                    eventProducer.sendEvent("product-admin-topic", productAdminEvent);

                    UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(productEntity);
                    ProductUserEvent productUserEvent = new ProductUserEvent("UPDATED", userProductResponse);
                    eventProducer.sendEvent("product-user-topic", productUserEvent);
                });
            }
            cartRepository.delete(cart);
        }
    }
}

