package com.ISA.Restaurant.event.producer;

import com.ISA.Restaurant.Dto.Event.OrderStatusUpdateDto;
import com.ISA.Restaurant.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusProducer {
    private final KafkaTemplate<String, OrderStatusUpdateDto> kafkaTemplate;

    @Value("${kafka.topic.order-status}")
    private String orderStatusTopic;

    public OrderStatusProducer(KafkaTemplate<String, OrderStatusUpdateDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderStatus(String orderId, OrderStatus status) {
        OrderStatusUpdateDto update = new OrderStatusUpdateDto(orderId, status.name());
        kafkaTemplate.send(orderStatusTopic, orderId, update);
    }
}
