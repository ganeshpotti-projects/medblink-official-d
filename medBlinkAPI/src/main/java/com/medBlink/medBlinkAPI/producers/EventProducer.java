package com.medBlink.medBlinkAPI.producers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public <T> void sendEvent(String topic, T event) {
        try {
            Message<T> message = MessageBuilder
                    .withPayload(event)
                    .setHeader(KafkaHeaders.TOPIC, topic)
                    .build();
            kafkaTemplate.send(message);
            log.info("Event sent successfully to topic: {}", topic);
        } catch (Exception e) {
            log.warn("Failed to send event to Kafka topic: {}. Error: {}. Continuing with registration...", topic, e.getMessage());
            // Don't throw exception - allow the registration to complete even if Kafka fails
        }
    }
}