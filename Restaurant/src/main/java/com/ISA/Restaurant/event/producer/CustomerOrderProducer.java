//package com.ISA.Restaurant.event.producer;
//
//import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CustomerOrderProducer {
//
//    private static final Logger logger = LoggerFactory.getLogger(CustomerOrderProducer.class);
//
//    private final KafkaTemplate<String, CustomerOrderDto> kafkaTemplate;
//
//    @Value("${kafka.topic.customer-orders}")
//    private String customerOrdersTopic;
//
//    public CustomerOrderProducer(KafkaTemplate<String, CustomerOrderDto> kafkaTemplate) {
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    public void sendCustomerOrder(CustomerOrderDto orderDto) {
//        logger.info("Sending customer order to Kafka topic: {}", customerOrdersTopic);
//        kafkaTemplate.send(customerOrdersTopic, orderDto.getOrderId(), orderDto);
//    }
//}
