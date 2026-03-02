package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.BatchEntity;
import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.events.ProductAdminEvent;
import com.medBlink.medBlinkAPI.events.ProductUserEvent;
import com.medBlink.medBlinkAPI.io.BatchRequest;
import com.medBlink.medBlinkAPI.io.BatchResponse;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.mappers.BatchMapper;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.BatchRepository;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BatchServiceImpl implements BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private BatchMapper batchMapper;

    @Autowired
    private EventProducer eventProducer;

    @Override
    public List<BatchResponse> getAllBatchesWithProductID(String productID) {
        List<BatchEntity> batches = batchRepository.findAllByProductID(productID);

        if (batches.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sorry, No Batch found!");
        }

        return batches.stream().map(batch -> batchMapper.convertToResponse(batch)).collect(Collectors.toList());
    }

    @Override
    public void addBatch(BatchRequest request) {
        BatchEntity batch = batchMapper.convertToEntity(request);
        batchRepository.save(batch);

//        update product entity with the newly saved batch quantity.
        ProductEntity product = productRepository.findById(request.getProductID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with productID: "+request.getProductID()));

        product.setBatchesStatus("AVAILABLE");
        product.setTotalAvailableQuantity(product.getTotalAvailableQuantity() + batch.getAvailableQuantity());
        product.setTotalSoldQuantity(product.getTotalSoldQuantity() + batch.getSoldQuantity());

        product.setProductMarketPrice(Math.max(product.getProductMarketPrice(), request.getMarketPrice()));
        product.setProductSellingPrice(Math.max(product.getProductSellingPrice(), request.getSellingPrice()));

        productRepository.save(product);

        UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(product);
        ProductUserEvent productUserEvent = new ProductUserEvent("UPDATED", userProductResponse);
        eventProducer.sendEvent("product-user-topic", productUserEvent);

        AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(product);
        ProductAdminEvent productAdminEvent = new ProductAdminEvent("UPDATED", adminProductResponse);
        eventProducer.sendEvent("product-admin-topic", productAdminEvent);
    }

    public void deleteBatch(String batchID){
        BatchEntity batchEntity = batchRepository.findById(batchID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Batch not found"));

        ProductEntity productEntity = productRepository.findById(batchEntity.getProductID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Product not found"));

        productEntity.setTotalAvailableQuantity(productEntity.getTotalAvailableQuantity() - batchEntity.getAvailableQuantity());

        if (batchEntity.getAvailableQuantity().equals( batchEntity.getPurchasedQuantity()) && batchEntity.getBlockedQuantity().equals(0)
                ) {
            batchRepository.deleteById(batchID);
            List<BatchEntity> batches = batchRepository.findAllByProductID(batchEntity.getProductID());
            if(batches.isEmpty()) {
                productEntity.setBatchesStatus("NOT_AVAILABLE");
                productEntity.setProductMarketPrice(0.0);
                productEntity.setProductSellingPrice(0.0);
                productEntity.setTotalAvailableQuantity(0);
                productEntity.setTotalSoldQuantity(0);
            } else {
                double maxMarketPrice = batches.stream()
                        .mapToDouble(BatchEntity::getMarketPrice)
                        .max()
                        .orElse(0.0);
                double maxSellingPrice = batches.stream()
                        .mapToDouble(BatchEntity::getSellingPrice)
                        .max()
                        .orElse(0.0);
                productEntity.setProductMarketPrice(maxMarketPrice);
                productEntity.setProductSellingPrice(maxSellingPrice);
                if(productEntity.getTotalAvailableQuantity()==0)
                {
                    productEntity.setBatchesStatus("UN_AVAILABLE");
                }else{
                    productEntity.setBatchesStatus("AVAILABLE");
                }
            }
            productRepository.save(productEntity);
            AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(productEntity);
            ProductAdminEvent productAdminEvent = new ProductAdminEvent("UPDATED", adminProductResponse);
            eventProducer.sendEvent("product-admin-topic", productAdminEvent);

            UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(productEntity);
            ProductUserEvent productUserEvent = new ProductUserEvent("UPDATED", userProductResponse);
            eventProducer.sendEvent("product-user-topic", productUserEvent);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Batch can't be deleted because some quantity is already sold");
        }
    }
}
