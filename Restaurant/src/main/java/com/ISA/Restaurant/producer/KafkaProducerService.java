package com.ISA.Restaurant.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "rider-request";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper(); // JSON serializer
    }

    public void sendRiderRequest(Order order) {
        try {
            // Convert Order object to JSON string
            String orderJson = objectMapper.writeValueAsString(order);
            kafkaTemplate.send(TOPIC, order.getOrderId(), orderJson);
            System.out.println("Order sent: " + orderJson);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to send order: " + order);
        }
    }
}
