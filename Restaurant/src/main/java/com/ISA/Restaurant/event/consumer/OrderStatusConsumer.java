//package com.ISA.Restaurant.event.consumer;
//
//import com.ISA.Restaurant.repo.OrderRepository;
//import com.ISA.Restaurant.service.OrderService;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class OrderStatusConsumer {
//
//    private static final Logger logger = LoggerFactory.getLogger(OrderStatusConsumer.class);
//
//    private final OrderService orderService;
//    private final ObjectMapper objectMapper;
//
//    public OrderStatusConsumer(OrderService orderService, ObjectMapper objectMapper) {
//        this.orderService = orderService; // Correctly assigning the injected OrderService
//        this.objectMapper = objectMapper;
//    }
//
//    @KafkaListener(topics = "${kafka.topic.order-status}", groupId = "order-status-group")
//    public void consumeOrderStatusUpdate(String message) {
//        logger.info("Received order status update: {}", message);
//
//        try {
//            // Parse the message as JSON
//            JsonNode jsonNode = objectMapper.readTree(message);
//            String orderId = jsonNode.get("orderId").asText();
//            String status = jsonNode.get("status").asText();
//
//            // Delegate the update to the OrderService
//            orderService.updateOrderStatus(orderId, status);
//
//        } catch (Exception e) {
//            logger.error("Error processing order status update: {}", e.getMessage(), e);
//        }
//    }
//}
