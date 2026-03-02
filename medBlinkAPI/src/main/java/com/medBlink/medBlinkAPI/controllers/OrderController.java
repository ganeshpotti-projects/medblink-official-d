package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.*;
import com.medBlink.medBlinkAPI.services.InvoiceService;
import com.medBlink.medBlinkAPI.services.OrderService;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final InvoiceService invoiceService;

    @GetMapping("/getAllOrders")
    public List<OrderResponse> getOrdersOfAllUsers(){
        return orderService.getOrdersOfAllUsers();
    }

    @GetMapping(value = "/getOrders")
    public List<OrderResponse> getOrders(){
        return orderService.getUserOrders();
    }

    @GetMapping(value = "/getPartnerOrders")
    public List<PartnerOrderResponse> getPartnerOrders()
    {
        return orderService.getPartnerOrders();
    }

    @GetMapping("/downloadInvoice/{orderID}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable String orderID) {
        byte[] pdfBytes = invoiceService.generateInvoice(orderID);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Invoice_" + orderID + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


    @PostMapping(value = "/createOrder")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest orderRequest) throws RazorpayException
    {
        OrderResponse response = orderService.createOrderWithPayment(orderRequest);
        return response;
    }

    @PostMapping(value = "/verifyOrder")
    public void verifyPayment(@RequestBody Map<String, String> paymentData){
        orderService.verifyPayment(paymentData,"Paid");
    }

    @PostMapping(value = "/submitFeedback/{orderID}")
    public OrderResponse submitFeedBack(@PathVariable String orderID, @RequestBody OrderFeedback orderFeedback)
    {
        return orderService.submitFeedback(orderID,orderFeedback);
    }

    @PatchMapping("/updateOrderStatus")
    public void updateOrderStatus(
            @RequestBody OrderStatusUpdateRequest request
    ) {
        orderService.updateOrderStatus(request);
    }

    @DeleteMapping(value = "deleteOrder/{orderID}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderID, @RequestParam String deleteOrderReason){
        orderService.removeOrder(orderID, deleteOrderReason);
    }
}
