package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.BatchRequest;
import com.medBlink.medBlinkAPI.io.BatchResponse;
import com.medBlink.medBlinkAPI.services.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/batches")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping(value = "/getAllBatches/{productID}")
    public List<BatchResponse> getAllBatches(@PathVariable String productID)
    {
        return batchService.getAllBatchesWithProductID(productID);
    }

    @PostMapping(value = "/addBatch")
    public void addBatch(@RequestBody BatchRequest request)
    {
        batchService.addBatch(request);
    }

    @DeleteMapping(value = "/deleteBatch/{batchID}")
    public void deleteBatch(@PathVariable String batchID)
    {
        batchService.deleteBatch(batchID);
    }
}
