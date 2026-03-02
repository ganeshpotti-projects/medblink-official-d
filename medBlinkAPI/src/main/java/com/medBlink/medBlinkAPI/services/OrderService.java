package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.io.*;
import com.razorpay.RazorpayException;

import java.util.List;
import java.util.Map;

public interface OrderService {
    OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;
    void verifyPayment(Map<String, String> paymentData, String orderStatus);
    List<OrderResponse> getUserOrders();
    void removeOrder(String orderId, String deleteOrderReason);
    List<OrderResponse> getOrdersOfAllUsers();
    void updateOrderStatus(OrderStatusUpdateRequest request);
    List<PartnerOrderResponse> getPartnerOrders();
    OrderResponse submitFeedback(String orderID, OrderFeedback orderFeedback);
}
