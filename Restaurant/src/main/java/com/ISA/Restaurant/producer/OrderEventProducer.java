//package com.ISA.Restaurant.producer;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
//public class OrderEventProducer {
//
//    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
//
////    @Value("${kafka.topic.order-status}")
//    @Value("order-restaurant-request")
//    private String orderStatusTopic;
//
//    public OrderEventProducer(KafkaTemplate<String, OrderEvent> kafkaTemplate) {
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    public void sendOrderEvent(OrderEvent event) {
//        log.info("Sending order event: {}", event);
//        kafkaTemplate.send(orderStatusTopic, event.getOrderId(), event);
//    }
//}
