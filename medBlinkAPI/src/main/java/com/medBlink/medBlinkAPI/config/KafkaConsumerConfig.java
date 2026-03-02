package com.medBlink.medBlinkAPI.config;

import com.medBlink.medBlinkAPI.events.*;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {
    private Map<String, Object> consumerConfigs(String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, ProductAdminEvent> productAdminConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs("medblink-group"),
                new StringDeserializer(),
                new JsonDeserializer<>(ProductAdminEvent.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductAdminEvent> productAdminKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ProductAdminEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(productAdminConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, ProductUserEvent> productUserConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs("medblink-group"),
                new StringDeserializer(),
                new JsonDeserializer<>(ProductUserEvent.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductUserEvent> productUserKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ProductUserEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(productUserConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, PartnerEvent> partnerConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs("medblink-group"),
                new StringDeserializer(),
                new JsonDeserializer<>(PartnerEvent.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PartnerEvent> partnerKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PartnerEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(partnerConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, OrderEvent> orderConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs("medblink-group"),
                new StringDeserializer(),
                new JsonDeserializer<>(OrderEvent.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderEvent> orderKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(orderConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, PartnerOrderEvent> partnerOrderConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs("medblink-group"),
                new StringDeserializer(),
                new JsonDeserializer<>(PartnerOrderEvent.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PartnerOrderEvent> partnerOrderKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PartnerOrderEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(partnerOrderConsumerFactory());
        return factory;
    }
}