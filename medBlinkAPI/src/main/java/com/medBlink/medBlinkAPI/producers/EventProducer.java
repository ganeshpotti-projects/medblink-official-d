package com.medBlink.medBlinkAPI.producers;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public <T> void sendEvent(String topic, T event) {
        kafkaTemplate.send(topic, event);
    }
}