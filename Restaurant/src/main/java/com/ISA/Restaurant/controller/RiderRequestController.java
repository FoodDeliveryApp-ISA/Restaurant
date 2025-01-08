package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.producer.KafkaProducerService;
import com.ISA.Restaurant.producer.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rider-request")
public class RiderRequestController {

    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public RiderRequestController(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    @PostMapping
    public ResponseEntity<String> sendRiderRequest(@RequestBody Order order) {
        // Call the KafkaProducerService to send the rider request
        kafkaProducerService.sendRiderRequest(order);
        return ResponseEntity.ok("Rider request sent successfully for orderId: " + order.getOrderId());
    }
}
