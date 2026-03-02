package com.medBlink.medBlinkAPI.mappers;

import com.medBlink.medBlinkAPI.entities.BatchEntity;
import com.medBlink.medBlinkAPI.io.BatchRequest;
import com.medBlink.medBlinkAPI.io.BatchResponse;
import org.springframework.stereotype.Component;

@Component
public class BatchMapper {

    public static BatchEntity convertToEntity(BatchRequest request)
    {
        return BatchEntity.builder()
                .productID(request.getProductID())
                .batchNumber(request.getBatchNumber())
                .status("AVAILABLE")
                .manufacturedDate(request.getManufacturedDate())
                .expiryDate(request.getExpiryDate())
                .pack(request.getPack())
                .purchasedQuantity(request.getPurchasedQuantity())
                .availableQuantity(request.getPurchasedQuantity())
                .blockedQuantity(0)
                .soldQuantity(0)
                .costPrice(request.getCostPrice())
                .marketPrice(request.getMarketPrice())
                .sellingPrice(request.getSellingPrice())
                .hsnCode(request.getHsnCode())
                .gst(request.getGst())
                .build();
    }

    public static BatchResponse convertToResponse(BatchEntity entity) {
        return BatchResponse.builder()
                .batchID(entity.getBatchID())
                .productID(entity.getProductID())
                .batchNumber(entity.getBatchNumber())
                .status(entity.getStatus())
                .manufacturedDate(entity.getManufacturedDate())
                .expiryDate(entity.getExpiryDate())
                .pack(entity.getPack())
                .purchasedQuantity(entity.getPurchasedQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .soldQuantity(entity.getSoldQuantity())
                .costPrice(entity.getCostPrice())
                .marketPrice(entity.getMarketPrice())
                .sellingPrice(entity.getSellingPrice())
                .hsnCode(entity.getHsnCode())
                .gst(entity.getGst())
                .build();
    }
}
