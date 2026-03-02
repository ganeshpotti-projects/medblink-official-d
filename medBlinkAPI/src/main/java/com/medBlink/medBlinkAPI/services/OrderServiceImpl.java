package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.*;
import com.medBlink.medBlinkAPI.events.*;
import com.medBlink.medBlinkAPI.io.*;
import com.medBlink.medBlinkAPI.io.products.admin.AdminProductResponse;
import com.medBlink.medBlinkAPI.io.products.user.UserProductResponse;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Value("${razorpay_key}")
    private String RAZORPAY_KEY;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Value("${razorpay_secret_key}")
    private String RAZORPAY_SECRET_KEY;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PartnerService partnerService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EventProducer eventProducer;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
        OrderEntity newOrder = convertToEntity(request);
        newOrder = orderRepository.save(newOrder);

        RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET_KEY);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", newOrder.getGrandTotalAmount()*100);
        orderRequest.put("currency", "INR");
        orderRequest.put("payment_capture", 1);

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        newOrder.setRazorpayOrderID(razorpayOrder.get("id"));
        String loggedInUserID = userService.findByUserID();
        newOrder.setUserID(loggedInUserID);
        newOrder = orderRepository.save(newOrder);
        return convertToResponse(newOrder);
    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String orderStatus) {
        String razorpayOrderID = paymentData.get("razorpay_order_id");
        OrderEntity existingOrder = orderRepository.findByRazorpayOrderID(razorpayOrderID)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        existingOrder.setPaymentStatus(orderStatus);
        existingOrder.setRazorpaySignature(paymentData.get("razorpay_signature"));
        existingOrder.setRazorpayPaymentID(paymentData.get("razorpay_payment_id"));
        orderRepository.save(existingOrder);

        if ("paid".equalsIgnoreCase(orderStatus)) {
            existingOrder.setOrderedDate(Instant.now());
            cartService.confirmCartAfterPayment(existingOrder.getUserID());
            cartRepository.deleteByUserID(existingOrder.getUserID());

            existingOrder.getOrderedItems().forEach(item -> {
                if (item.getProductID() == null || item.getBatchID() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Invalid order item: missing productID or batchID");
                }

                ProductEntity productEntity = productRepository.findById(item.getProductID())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                productEntity.setTotalSoldQuantity(productEntity.getTotalSoldQuantity() + item.getProductQuantity());
                productRepository.save(productEntity);

                AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(productEntity);
                ProductAdminEvent productAdminEvent = new ProductAdminEvent("UPDATED", adminProductResponse);
                eventProducer.sendEvent("product-admin-topic", productAdminEvent);

                UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(productEntity);
                ProductUserEvent productUserEvent = new ProductUserEvent("UPDATED", userProductResponse);
                eventProducer.sendEvent("product-user-topic", productUserEvent);
            });
        }else {
            existingOrder.getOrderedItems().forEach(item -> {
                if (item.getProductID() == null || item.getBatchID() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Invalid order item: missing productID or batchID");
                }

                BatchEntity batchEntity = batchRepository.findById(item.getBatchID())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
                batchEntity.setAvailableQuantity(batchEntity.getAvailableQuantity() + item.getProductQuantity());
                batchEntity.setBlockedQuantity(batchEntity.getBlockedQuantity() - item.getProductQuantity());
                batchRepository.save(batchEntity);
                if (batchEntity.getAvailableQuantity() > 0) {
                    batchEntity.setStatus("AVAILABLE");
                } else {
                    batchEntity.setStatus("NOT_AVAILABLE");
                }
                batchRepository.save(batchEntity);
                ProductEntity productEntity = productRepository.findById(item.getProductID())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                productEntity.setTotalAvailableQuantity(productEntity.getTotalAvailableQuantity() + item.getProductQuantity());
                productRepository.save(productEntity);

                if(productEntity.getTotalAvailableQuantity() > 0)
                {
                    productEntity.setBatchesStatus("AVAILABLE");
                }else{
                    productEntity.setBatchesStatus("UN_AVAILABLE");
                }
                productRepository.save(productEntity);
                AdminProductResponse adminProductResponse = productService.getUpdatedAdminProductResponse(productEntity);
                eventProducer.sendEvent("product-admin-topic", new ProductAdminEvent("UPDATED", adminProductResponse));

                UserProductResponse userProductResponse = productService.getUpdatedUserProductResponse(productEntity);
                eventProducer.sendEvent("product-user-topic", new ProductUserEvent("UPDATED", userProductResponse));
            });
        }

        OrderResponse orderResponse = convertToResponse(existingOrder);
        OrderEvent orderEvent = new OrderEvent("VERIFIED", orderResponse);
        eventProducer.sendEvent("order-topic", orderEvent);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserID();
        List<OrderEntity> list = orderRepository.findByUserID(loggedInUserId);
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public List<PartnerOrderResponse> getPartnerOrders() {
        String loggedInPartnerEmail = authenticationFacade.getAuthentication().getName();
        PartnerEntity partner = partnerRepository.findByEmail(loggedInPartnerEmail)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        String partnerID = partner.getPartnerID();
        List<OrderEntity> partnerOrders = orderRepository.findByPartnerID(partnerID);
        return partnerOrders.stream().map(entity -> convertToPartnerResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderID, String deleteOrderReason) {
        OrderEntity order = orderRepository.findById(orderID).orElseThrow(() -> new RuntimeException("Order Not Found"));

        String userID = order.getUserID();
        UserEntity user = userRepository.findById(userID)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        orderRepository.deleteById(orderID);
        if(deleteOrderReason.equals("user_permanently_deleted"))
            return;
        sendRegretEmail(user.getName(), user.getEmail(), orderID, deleteOrderReason);
    }

    private void sendRegretEmail(String userName, String toEmail, String orderID, String deleteOrderReason)
    {
        deleteOrderReason= deleteOrderReason.replace('_', ' ');
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MedBlink Order Cancellation");
        message.setText("Dear " + userName + ",\n\n"
                + "Sorry! We are unable to deliver your order: " + orderID+ " to your address due to " + deleteOrderReason+".\n\n"
                + "Thanks for your understanding.\n\n"
                + "Best regards,\nMedBlink Admin Team");
        mailSender.send(message);
    }

    @Override
    public void updateOrderStatus(OrderStatusUpdateRequest request) {
        OrderEntity entity = orderRepository.findById(request.getOrderID())
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        String newStatus = request.getOrderStatus();
        entity.setOrderStatus(newStatus);

        if ("Out for Delivery".equalsIgnoreCase(newStatus)) {
            if (request.getPartnerID() == null || request.getPartnerID().isEmpty()) {
                throw new IllegalArgumentException("partnerID is required for 'Out for Delivery' status");
            }

            PartnerEntity partner = partnerRepository.findById(request.getPartnerID())
                    .orElseThrow(() -> new UsernameNotFoundException("Partner not found"));

            entity.setPartnerID(partner.getPartnerID());

            PartnerDetails details = PartnerDetails.builder()
                    .name(partner.getName())
                    .phoneNumber(partner.getPhoneNumber())
                    .email(partner.getEmail())
                    .build();

            entity.setPartnerDetails(details);
        }

        if ("Delivered".equalsIgnoreCase(newStatus)) {
            entity.setDeliveredDate(Instant.now());
            PartnerEntity partner = partnerRepository.findById(entity.getPartnerID())
                    .orElseThrow(() -> new UsernameNotFoundException("Partner not found"));
            int updatedOrdersDelivered = partner.getOrdersDelivered() + 1;
            partner.setOrdersDelivered(updatedOrdersDelivered);

            BlinkPoints blinkPoints = partner.getBlinkPoints();
            int current = blinkPoints.getCurrentBlinkPoints();
            int total = blinkPoints.getTotalBlinkPoints();
            if (total == 0) {
                current += 250;
                total += 250;
            } else {
                current += 10;
                total += 10;
            }
            if (updatedOrdersDelivered % 10 == 0) {
                current += 20;
                total += 20;
            }
            blinkPoints.setCurrentBlinkPoints(current);
            blinkPoints.setTotalBlinkPoints(total);
            partner.setBlinkPoints(blinkPoints);

            PartnerIncome partnerIncome = partner.getPartnerIncome();
            partnerIncome.setMonthlyOrders(partnerIncome.getMonthlyOrders()+1);
            partnerIncome.setYearlyOrders(partnerIncome.getYearlyOrders()+1);
            partner.setPartnerIncome(partnerIncome);

            PartnerDetails details = PartnerDetails.builder()
                    .name(partner.getName())
                    .phoneNumber(partner.getPhoneNumber())
                    .email(partner.getEmail())
                    .ordersDelivered(updatedOrdersDelivered)
                    .build();
            entity.setPartnerDetails(details);
            partnerRepository.save(partner);
            PartnerResponse response = partnerService.getPartnerResponse(partner);
            PartnerEvent event = new PartnerEvent("UPDATED", response);
            eventProducer.sendEvent("partner-topic", event);
        }

        orderRepository.save(entity);
        OrderResponse response = convertToResponse(entity);
        PartnerOrderResponse partnerResponse = convertToPartnerResponse(entity);

        if("Out for Delivery".equalsIgnoreCase(newStatus) || "Delivered".equalsIgnoreCase(newStatus)) {
            PartnerOrderEvent event = new PartnerOrderEvent("UPDATED_STATUS", partnerResponse);
            eventProducer.sendEvent("partner-order-topic", event);
        }
        OrderEvent event = new OrderEvent("UPDATED_STATUS", response);
        eventProducer.sendEvent("order-topic",event);
    }

    @Override
    public OrderResponse submitFeedback(String orderID, OrderFeedback orderFeedback){
        OrderEntity existingOrder = orderRepository.findById(orderID).orElseThrow(() -> new RuntimeException("Order not found"));

        existingOrder.setOrderFeedback(orderFeedback);
        existingOrder.setIsOrderFeedBackReceived(true);

        existingOrder = orderRepository.save(existingOrder);

        OrderResponse response = convertToResponse(existingOrder);
        OrderEvent event = new OrderEvent("FB_SUBMITTED", response);
        eventProducer.sendEvent("order-topic",event);
        return convertToResponse(existingOrder);
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        double subTotal = 0.0;
        double tax = 0.0;
        double shipping = 15.0;

        for (OrderItem item : request.getOrderedItems()) {
            BatchEntity batch = batchRepository.findById(item.getBatchID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch Not Found"));
            double itemTotal = batch.getSellingPrice() * item.getProductQuantity();
            subTotal += itemTotal;
            tax += (batch.getSellingPrice() * batch.getGst() / 100) * item.getProductQuantity();
        }

        double totalBeforeRound = subTotal + tax + shipping;
        double roundOff = Math.round(totalBeforeRound) - totalBeforeRound;
        double grandTotal = Math.round(totalBeforeRound);

        return OrderEntity.builder()
                .orderedItems(request.getOrderedItems())
                .userAddress(request.getUserAddress())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .subTotalAmount(subTotal)
                .taxAmount(tax)
                .shippingPrice(shipping)
                .roundOffAmount(roundOff)
                .grandTotalAmount(grandTotal)
                .orderStatus(request.getOrderStatus())
                .orderedDate(Instant.now())
                .deliveredDate(Instant.now())
                .build();
    }


    private OrderResponse convertToResponse(OrderEntity newOrder) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withZone(ZoneId.of("Asia/Kolkata"));

        return OrderResponse.builder()
                .orderID(newOrder.getOrderID())
                .userID(newOrder.getUserID())
                .partnerID(newOrder.getPartnerID())
                .userAddress(newOrder.getUserAddress())
                .grandTotalAmount(newOrder.getGrandTotalAmount())
                .razorpayOrderID(newOrder.getRazorpayOrderID())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .isOrderFeedbackReceived(newOrder.getIsOrderFeedBackReceived())
                .orderFeedback(newOrder.getOrderFeedback())
                .partnerDetails(newOrder.getPartnerDetails())
                .orderedDate(newOrder.getOrderedDate() != null ? formatter.format(newOrder.getOrderedDate()) : null)
                .deliveredDate(newOrder.getDeliveredDate() != null ? formatter.format(newOrder.getDeliveredDate()) : null)
                .build();
    }

    private PartnerOrderResponse convertToPartnerResponse(OrderEntity order)
    {
        return PartnerOrderResponse.builder()
                .orderID(order.getOrderID())
                .userID(order.getUserID())
                .partnerID(order.getPartnerID())
                .userAddress(order.getUserAddress())
                .grandTotalAmount(order.getGrandTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .orderedItems(order.getOrderedItems())
                .build();
    }
}
