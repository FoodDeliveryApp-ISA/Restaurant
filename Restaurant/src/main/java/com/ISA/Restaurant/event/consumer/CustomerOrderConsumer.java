//package com.ISA.Restaurant.event.consumer;
//
//import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
//import com.ISA.Restaurant.service.OrderService;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CustomerOrderConsumer {
//
//    private final OrderService orderService;
//
//    public CustomerOrderConsumer(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    @KafkaListener(
//            topics = "${kafka.topic.customer-orders}",
//            groupId = "restaurant-service",
//            containerFactory = "customerOrderKafkaListenerContainerFactory"
//    )
//    public void consumeCustomerOrder(CustomerOrderDto orderDto) {
//        orderService.handleNewOrder(orderDto);
//    }
//}


