package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
import com.ISA.Restaurant.event.producer.CustomerOrderProducer;
import com.ISA.Restaurant.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/order")
public class OrderController {
    private static final Logger logger = (Logger) LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;
    private final CustomerOrderProducer orderProducer;

    public OrderController(OrderService orderService, CustomerOrderProducer orderProducer) {
        this.orderService = orderService;
        this.orderProducer = orderProducer;
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody CustomerOrderDto orderDto) {
        logger.info("Received new customer order: {}",orderDto.toString());
        orderProducer.sendCustomerOrder(orderDto);
        return ResponseEntity.ok("Order submitted successfully!");
    }

    @PostMapping("/accept/{orderId}")
    public ResponseEntity<String> acceptOrder(@PathVariable String orderId) {
        orderService.acceptOrder(orderId);
        return ResponseEntity.ok("Order accepted and rider request initiated.");
    }

    @PostMapping("/request-riders/{orderId}")
    public ResponseEntity<String> requestRiders(@PathVariable String orderId) {
        orderService.requestRider(orderId);
        return ResponseEntity.ok("Rider request initiated.");
    }

    @PostMapping("/on-the-way/{orderId}")
    public ResponseEntity<String> orderOnTheWay(@PathVariable String orderId) {
        orderService.orderOnTheWay(orderId);
        return ResponseEntity.ok("Order status updated to 'ON_THE_WAY'.");
    }

    @PostMapping("/delivered/{orderId}")
    public ResponseEntity<String> markOrderDelivered(@PathVariable String orderId) {
        orderService.markOrderDelivered(orderId);
        return ResponseEntity.ok("Order marked as 'ORDER_DELIVERED'.");
    }

    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Order cancelled successfully.");
    }
}
