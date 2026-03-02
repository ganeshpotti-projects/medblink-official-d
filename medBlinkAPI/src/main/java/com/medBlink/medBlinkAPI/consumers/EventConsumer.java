package com.medBlink.medBlinkAPI.consumers;

import com.medBlink.medBlinkAPI.events.*;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    public EventConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "product-admin-topic", groupId = "medblink-group",
            containerFactory = "productAdminKafkaListenerContainerFactory")
    public void consumeProduct(ProductAdminEvent event) {
        messagingTemplate.convertAndSend("/topic/product-admin-updates", event);
    }

    @KafkaListener(topics = "product-user-topic", groupId = "medblink-group",
            containerFactory = "productUserKafkaListenerContainerFactory")
    public void consumeProduct(ProductUserEvent event) {
        messagingTemplate.convertAndSend("/topic/product-user-updates", event);
    }

    @KafkaListener(topics = "partner-topic", groupId = "medblink-group",
            containerFactory = "partnerKafkaListenerContainerFactory")
    public void consumePartner(PartnerEvent event) {
        messagingTemplate.convertAndSend("/topic/partner-updates", event);
    }

    @KafkaListener(topics = "order-topic", groupId = "medblink-group" , containerFactory = "orderKafkaListenerContainerFactory")
    public void consumeOrder(OrderEvent event)
    {
        messagingTemplate.convertAndSend("/topic/order-updates", event);
    }

    @KafkaListener(topics = "partner-order-topic", groupId = "medblink-group" , containerFactory = "partnerOrderKafkaListenerContainerFactory")
    public void consumeOrder(PartnerOrderEvent event)
    {
        messagingTemplate.convertAndSend("/topic/partner-order-updates", event);
    }
}
