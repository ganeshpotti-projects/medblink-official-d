package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.BatchRequest;
import com.medBlink.medBlinkAPI.io.BatchResponse;

import java.util.List;

public interface BatchService {
    List<BatchResponse> getAllBatchesWithProductID(String productID);
    void addBatch(BatchRequest request);
    void deleteBatch(String batchID);
}
