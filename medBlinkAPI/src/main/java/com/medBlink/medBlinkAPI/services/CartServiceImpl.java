package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.BatchEntity;
import com.medBlink.medBlinkAPI.entities.CartEntity;
import com.medBlink.medBlinkAPI.entities.CartItemEntity;
import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.events.ProductAdminEvent;
import com.medBlink.medBlinkAPI.events.ProductUserEvent;
import com.medBlink.medBlinkAPI.io.CartItemResponse;
import com.medBlink.medBlinkAPI.io.CartRequest;
import com.medBlink.medBlinkAPI.io.CartResponse;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.BatchRepository;
import com.medBlink.medBlinkAPI.repositories.CartRepository;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;
    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final EventProducer eventProducer;

        @Override
        public CartResponse addToCart(CartRequest request) {
            String userID = userService.findByUserID();

            CartEntity cart = cartRepository.findByUserID(userID)
                    .orElseGet(() -> CartEntity.builder()
                            .userID(userID)
                            .items(new ArrayList<>())
                            .createdAt(LocalDateTime.now())
                            .expiresAt(LocalDateTime.now().plusMinutes(10))
                            .expired(false)
                            .build());

            List<BatchEntity> batches = batchRepository.findAllByProductID(request.getProductID());
            if (batches.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Batches not found");
            }

            batches.sort(Comparator.comparing(BatchEntity::getExpiryDate));

            int requiredQty = 1;
            List<CartItemEntity> newItems = new ArrayList<>();

            for (BatchEntity batch : batches) {
                if (requiredQty <= 0) break;
                int available = batch.getAvailableQuantity();
                if (available <= 0) {
                    batch.setStatus("NOT_AVAILABLE");
                    continue;
                }
                int allocate = Math.min(requiredQty, available);

                batch.setAvailableQuantity(batch.getAvailableQuantity() - allocate);
                batch.setBlockedQuantity(batch.getBlockedQuantity() + allocate);
                batchRepository.save(batch);
                if (batch.getAvailableQuantity() == 0) {
                    batch.setStatus("NOT_AVAILABLE");
                } else {
                    batch.setStatus("AVAILABLE");
                }
                batchRepository.save(batch);
                String productID = batch.getProductID();
                ProductEntity productEntity = productRepository.findById(productID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                productEntity.setTotalAvailableQuantity(productEntity.getTotalAvailableQuantity() - allocate);
                productRepository.save(productEntity);
                if(productEntity.getTotalAvailableQuantity() == 0)
                {
                    productEntity.setBatchesStatus("UN_AVAILABLE");
                }else{
                    productEntity.setBatchesStatus("AVAILABLE");
                }

                AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(productEntity);
                ProductAdminEvent productAdminEvent = new ProductAdminEvent("UPDATED", adminProductResponse);
                eventProducer.sendEvent("product-admin-topic", productAdminEvent);

                UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(productEntity);
                ProductUserEvent productUserEvent = new ProductUserEvent("UPDATED", userProductResponse);
                eventProducer.sendEvent("product-user-topic", productUserEvent);

                Optional<CartItemEntity> existingItemOpt = cart.getItems().stream()
                        .filter(i -> i.getProductID().equals(request.getProductID()) && i.getBatchID().equals(batch.getBatchID()))
                        .findFirst();

                if (existingItemOpt.isPresent()) {
                    existingItemOpt.get().setQuantity(existingItemOpt.get().getQuantity() + allocate);
                } else {
                    newItems.add(CartItemEntity.builder()
                            .productID(request.getProductID())
                            .batchID(batch.getBatchID())
                            .quantity(allocate)
                            .marketPrice(batch.getMarketPrice())
                            .pack(batch.getPack())
                            .sellingPrice(batch.getSellingPrice())
                            .gst(batch.getGst())
                            .build());
                }

                requiredQty -= allocate;
            }

            if (requiredQty > 0) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not found");
            }

            cart.getItems().addAll(newItems);
            cart = cartRepository.save(cart);

            return convertToResponse(cart, batches);
        }

        @Override
        public CartResponse removeFromCart(CartRequest request) {
            String userID = userService.findByUserID();
            CartEntity cart = cartRepository.findByUserID(userID)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            int qtyToRemove = request.getQuantity();

            List<CartItemEntity> productItems = cart.getItems().stream()
                    .filter(i -> i.getProductID().equals(request.getProductID()))
                    .collect(Collectors.toList());

            if (productItems.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Products not found in cart");
            }

            List<BatchEntity> batches = batchRepository.findAllByProductID(request.getProductID());

            Map<String, String> batchExpiryMap = batches.stream()
                    .collect(Collectors.toMap(BatchEntity::getBatchID, BatchEntity::getExpiryDate));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            productItems.sort((a, b) -> {
                LocalDate dateB = LocalDate.parse(batchExpiryMap.get(b.getBatchID()), formatter);
                LocalDate dateA = LocalDate.parse(batchExpiryMap.get(a.getBatchID()), formatter);
                return dateB.compareTo(dateA);
            });

            for (CartItemEntity item : productItems) {
                if (qtyToRemove <= 0) break;

                int remove = Math.min(item.getQuantity(), qtyToRemove);

                batchRepository.findById(item.getBatchID()).ifPresent(batch -> {
                    batch.setAvailableQuantity(batch.getAvailableQuantity() + remove);
                    batch.setBlockedQuantity(batch.getBlockedQuantity() - remove);
                    batchRepository.save(batch);
                    if (batch.getAvailableQuantity() > 0) {
                        batch.setStatus("AVAILABLE");
                    } else {
                        batch.setStatus("NOT_AVAILABLE");
                    }
                    batchRepository.save(batch);
                    String productID = batch.getProductID();
                    ProductEntity productEntity = productRepository.findById(productID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                    productEntity.setTotalAvailableQuantity(productEntity.getTotalAvailableQuantity() + remove);
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

                item.setQuantity(item.getQuantity() - remove);
                qtyToRemove -= remove;
            }

            cart.getItems().removeIf(i -> i.getQuantity() <= 0);

            cart = cartRepository.save(cart);
            return convertToResponse(cart, batches);
        }

        @Override
        public CartResponse getCart() {
            String userID = userService.findByUserID();
            CartEntity cart = cartRepository.findByUserID(userID)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

            List<String> batchIds = cart.getItems().stream().map(CartItemEntity::getBatchID).toList();
            Map<String, BatchEntity> batchMap = batchRepository.findAllById(batchIds)
                    .stream().collect(Collectors.toMap(BatchEntity::getBatchID, b -> b));

            return CartResponse.builder()
                    .cartID(cart.getCartID())
                    .items(cart.getItems().stream().map(item -> {
                        BatchEntity batch = batchMap.get(item.getBatchID());
                        return CartItemResponse.builder()
                                .productID(item.getProductID())
                                .batchID(item.getBatchID())
                                .quantity(item.getQuantity())
                                .pack(item.getPack())
                                .marketPrice(item.getMarketPrice())
                                .sellingPrice(item.getSellingPrice())
                                .gst(item.getGst())
                                .build();
                    }).toList())
                    .build();
        }

        @Override
        public void confirmCartAfterPayment(String userID) {
            CartEntity cart = cartRepository.findByUserID(userID)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            for (CartItemEntity item : cart.getItems()) {
                batchRepository.findById(item.getBatchID()).ifPresent(batch -> {
                    batch.setBlockedQuantity(batch.getBlockedQuantity() - item.getQuantity());
                    batch.setSoldQuantity(batch.getSoldQuantity() + item.getQuantity());
                    batchRepository.save(batch);
                });
            }

            cart.setExpired(false);
            cart.setExpiresAt(null);
            cartRepository.save(cart);
        }

        @Override
        public void clearCart() {
            String loggedInUserId = userService.findByUserID();
            cartRepository.deleteByUserID(loggedInUserId);
        }

        private CartResponse convertToResponse(CartEntity cart, List<BatchEntity> batches) {
            Map<String, BatchEntity> batchMap = batches != null
                    ? batches.stream().collect(Collectors.toMap(BatchEntity::getBatchID, b -> b))
                    : Collections.emptyMap();

            return CartResponse.builder()
                    .cartID(cart.getCartID())
                    .items(cart.getItems().stream().map(item -> {
                        BatchEntity batch = batchMap.get(item.getBatchID());
                        return CartItemResponse.builder()
                                .productID(item.getProductID())
                                .batchID(item.getBatchID())
                                .quantity(item.getQuantity())
                                .pack(item.getPack())
                                .marketPrice(item.getMarketPrice())
                                .sellingPrice(item.getSellingPrice())
                                .gst(item.getGst())
                                .build();
                    }).toList())
                    .build();
        }
}
