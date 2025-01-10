package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.producer.OrderEvent;
import com.ISA.Restaurant.producer.OrderEventProducer;
import com.ISA.Restaurant.producer.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    private final OrderEventProducer producer;

    public OrderController(OrderEventProducer producer) {
        this.producer = producer;
    }

    @PostMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable String orderId, @RequestBody OrderStatus status) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(orderId);
        event.setStatus(status);
        log.info("Sending order event: {}", event);
        producer.sendOrderEvent(event);
        return ResponseEntity.ok("Order status updated to: " + status);
    }
}

