package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Order;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.enums.OrderStatus;
import com.ISA.Restaurant.event.producer.OrderStatusProducer;
import com.ISA.Restaurant.event.producer.RiderRequestProducer;
import com.ISA.Restaurant.exception.InvalidOrderStateTransitionException;
import com.ISA.Restaurant.exception.OrderNotFoundException;
import com.ISA.Restaurant.exception.SameOrderStateException;
import com.ISA.Restaurant.mapper.OrderMapper;
import com.ISA.Restaurant.repo.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderStatusProducer orderStatusProducer;
    private final RiderRequestProducer riderRequestProducer;
    private final RestaurentService restaurantService ;

    public OrderService(OrderRepository orderRepository,
                        OrderStatusProducer orderStatusProducer,
                        RiderRequestProducer riderRequestProducer,
                        RestaurentService restaurantService) {
        this.orderRepository = orderRepository;
        this.orderStatusProducer = orderStatusProducer;
        this.riderRequestProducer = riderRequestProducer;
        this.restaurantService = restaurantService;
    }

    public void handleNewOrder(CustomerOrderDto orderDto) {
        logger.info("Handling new order: {}", orderDto);
        int restaurantId = Integer.parseInt(orderDto.getRestaurantId());

        // Fetch restaurant details
        RestaurantDto restaurantDetails = restaurantService.getRestaurantById(restaurantId);
        logger.info("Fetched restaurant details: {}", restaurantDetails);

        // Map CustomerOrderDto to Order and fill restaurant details
        Order order = OrderMapper.toEntity(orderDto);
        order.setRestaurantName(restaurantDetails.getRestaurantName());
        order.setRestaurantAddress(restaurantDetails.getRestaurantAddress());
        order.setRestaurantPhone(restaurantDetails.getRestaurantPhone());

        // Convert restaurant location from String to List<Double>
        List<Double> restaurantLocation = convertStringToList(restaurantDetails.getRestaurantLocation());
        order.setRestaurantLocation(restaurantLocation);

        // Set default status
        order.setStatus(OrderStatus.ORDER_PLACED);

        // Set the created date
        order.setCreatedDate(LocalDateTime.now());

        // Save the order to the repository
        orderRepository.save(order);

        // Send initial status update to Kafka
        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ORDER_PLACED);

        logger.info("New order created with ID: {} and initial status: {}", order.getOrderId(), OrderStatus.ORDER_PLACED);
    }


    public void acceptOrder(String orderId) {
        logger.info("Accepting order with ID: {}", orderId);
        Order order = getOrderById(orderId);
        validateStateTransition(order.getStatus(), OrderStatus.PREPARING);

        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.PREPARING);

    }

    public void requestRider(String orderId) {
        Order order = getOrderById(orderId);
        validateStateTransition(order.getStatus(), OrderStatus.ASSIGNING_RIDER);
        RiderRequestDto riderRequest = OrderMapper.toRiderRequestDto(order);
        riderRequestProducer.sendRiderRequest(riderRequest);
        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ASSIGNING_RIDER);
    }

    public void orderOnTheWay(String orderId) {
        logger.info("Updating order ID {} to 'ON_THE_WAY'", orderId);
        Order order = getOrderById(orderId);
        validateStateTransition(order.getStatus(), OrderStatus.ON_THE_WAY);
        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ON_THE_WAY);
    }

    public void markOrderDelivered(String orderId) {
        logger.info("Marking order ID {} as 'ORDER_DELIVERED'", orderId);
        Order order = getOrderById(orderId);
        validateStateTransition(order.getStatus(), OrderStatus.ORDER_DELIVERED);
        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ORDER_DELIVERED);
    }

    public void cancelOrder(String orderId) {
        logger.warn("Cancelling order ID {}", orderId);
        Order order = getOrderById(orderId);
        validateStateTransition(order.getStatus(), OrderStatus.ORDER_CANCELLED);
        orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ORDER_CANCELLED);
    }

    private Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
    }
    public void updateOrderStatus(String orderId, String status) {
        try {
            logger.info("Updating order status. Order ID: {}, New Status: {}", orderId, status);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

            OrderStatus currentStatus = order.getStatus();
            OrderStatus newStatus = OrderStatus.valueOf(status);

            // Skip update if the current status matches the new status
            if (currentStatus != null && currentStatus.equals(newStatus)) {
                logger.warn("Order ID {} is already in the state: {}. Skipping update.", orderId, currentStatus);
                return;
            }

            validateStateTransition(currentStatus, newStatus);

            order.setStatus(newStatus);
            orderRepository.save(order);

            logger.info("Order ID {} updated successfully to status {}", orderId, newStatus);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid status update for order ID {}: {}", orderId, e.getMessage());
            throw e;
        } catch (OrderNotFoundException e) {
            logger.error("Order not found: {}", e.getMessage());
            throw e;
        }
    }

    private void validateStateTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        logger.info("Validating state transition: currentStatus={}, newStatus={}", currentStatus, newStatus);

        if (currentStatus == null) {
            logger.info("Current status is null. Allowing transition to initial state: {}", newStatus);
            if (newStatus != OrderStatus.ORDER_PLACED) {
                throw new InvalidOrderStateTransitionException(
                        "Invalid initial state transition to " + newStatus
                );
            }
            return;
        }

        if (currentStatus.equals(newStatus)) {
            logger.warn("Order is already in the state: {}. Skipping update.", newStatus);
            return; // Skip the update instead of throwing an exception
        }

        if (newStatus == OrderStatus.ORDER_CANCELLED) {
            logger.info("Transition to ORDER_CANCELLED is allowed at any time.");
            return;
        }

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new InvalidOrderStateTransitionException(
                    "Invalid state transition from " + currentStatus + " to " + newStatus
            );
        }
    }

    private List<Double> convertStringToList(String locationString) {
        if (locationString == null || locationString.isEmpty()) {
            throw new IllegalArgumentException("Location string is null or empty");
        }

        try {
            return Arrays.stream(locationString.split(","))
                    .map(Double::parseDouble)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid location format: " + locationString, e);
        }
    }


}
