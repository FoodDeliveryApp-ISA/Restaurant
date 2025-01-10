package com.ISA.Restaurant.producer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {

    @KafkaListener(topics = "order-restaurant-request", groupId = "order-group")
    public void handleOrderEvent(OrderEvent event) {
        switch (event.getStatus()) {
            case ORDER_PLACED:
                handleOrderPlaced(event);
                break;
            case PREPARING:
                handleOrderPreparing(event);
                break;
            case ASSIGNING_RIDER:
                handleAssigningRider(event);
                break;
            case ON_THE_WAY:
                handleOnTheWay(event);
                break;
            case ORDER_DELIVERED:
                handleOrderDelivered(event);
                break;
            case ORDER_CANCELLED:
                handleOrderCancelled(event);
                break;
        }
    }

    private void handleOrderPlaced(OrderEvent event) {
        System.out.println("Order Placed: " + event);
        // Notify restaurant, update database...
    }

    private void handleOrderPreparing(OrderEvent event) {
        System.out.println("Order Preparing: " + event);
        // Notify customers, update database...
    }

    private void handleAssigningRider(OrderEvent event) {
        System.out.println("Assigning Rider: " + event);
        // Notify rider service...
    }

    private void handleOnTheWay(OrderEvent event) {
        System.out.println("Order On The Way: " + event);
        // Notify customers...
    }

    private void handleOrderDelivered(OrderEvent event) {
        System.out.println("Order Delivered: " + event);
        // Finalize order, update database...
    }

    private void handleOrderCancelled(OrderEvent event) {
        System.out.println("Order Cancelled: " + event);
        // Notify stakeholders, update database...
    }
}
