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
import com.ISA.Restaurant.utils.TimeUtility;
import com.ISA.Restaurant.utils.ValidationUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private static final int ORDER_PLACED_DELAY_MINUTES = 30;
    private static final int PREPARING_DELAY_MINUTES = 45;
    private static final int ON_THE_WAY_DELAY_MINUTES = 60;

    private final OrderRepository orderRepository;
    private final OrderStatusProducer orderStatusProducer;
    private final RiderRequestProducer riderRequestProducer;
    private final RestaurentService restaurantService;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, OrderStatusProducer orderStatusProducer,
                        RiderRequestProducer riderRequestProducer, RestaurentService restaurantService,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.orderStatusProducer = orderStatusProducer;
        this.riderRequestProducer = riderRequestProducer;
        this.restaurantService = restaurantService;
        this.notificationService = notificationService;
    }

    public void handleNewOrder(CustomerOrderDto orderDto) {
        logger.info("Handling new order: {}", orderDto);
        try {
            RestaurantDto restaurantDetails = fetchRestaurantDetails(orderDto);
            logger.info("********************************* {}",orderDto.toString());
            Order order = OrderMapper.createOrderEntity(orderDto, restaurantDetails);

            orderRepository.save(order);
            orderStatusProducer.sendOrderStatus(order.getOrderId(), OrderStatus.ORDER_PLACED);

            sendNotifications(orderDto, order);

            logger.info("Order created successfully. ID: {}, Status: {}", order.getOrderId(), OrderStatus.ORDER_PLACED);
        } catch (Exception e) {
            logger.error("Error while handling new order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to handle new order", e);
        }
    }

    public void acceptOrder(String orderId) {
        transitionOrderStatus(orderId, OrderStatus.PREPARING);
    }

    public void requestRider(String orderId) {
        Order order = getOrderById(orderId);
        transitionOrderStatus(order, OrderStatus.ASSIGNING_RIDER);
        RiderRequestDto riderRequest = OrderMapper.toRiderRequestDto(order);
        riderRequestProducer.sendRiderRequest(riderRequest);
    }

    public void orderOnTheWay(String orderId) {
        transitionOrderStatus(orderId, OrderStatus.ON_THE_WAY);
    }

    public void markOrderDelivered(String orderId) {
        transitionOrderStatus(orderId, OrderStatus.ORDER_DELIVERED);
    }

    public void cancelOrder(String orderId) {
        transitionOrderStatus(orderId, OrderStatus.ORDER_CANCELLED);
    }

    private Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
    }

    public List<Order> getOrdersByRestaurantId(String restaurantId, String sortBy, boolean ascending, List<String> statusFilters, String timeRange) {
        logger.info("Fetching orders for restaurant ID: {}", restaurantId);

        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        logger.info("********************************S {}", orders.toString());
        if (statusFilters != null && !statusFilters.isEmpty()) {
            orders = filterOrdersByStatus(orders, statusFilters);
        }

        if (timeRange != null) {
            orders = filterOrdersByTime(orders, timeRange);
        }

        sortOrders(orders, sortBy, ascending);

        logger.info("Fetched {} orders for restaurant ID: {}", orders.size(), restaurantId);
        return orders;
    }

    private List<Order> filterOrdersByTime(List<Order> orders, String timeRange) {
        LocalDateTime startTime = TimeUtility.calculateCutoffTime(timeRange);

        if (startTime == null) {
            return orders; // No filtering if time range is "all"
        }

        return orders.stream()
                .filter(order -> order.getCreatedDate().isAfter(startTime))
                .collect(Collectors.toList());
    }



    @Scheduled(fixedRate = 300000)
    public void scheduleOrderStatusUpdate() {
        List<Order> activeOrders = orderRepository.findByStatusNotIn(
                List.of(OrderStatus.ORDER_DELIVERED, OrderStatus.ORDER_CANCELLED));
        LocalDateTime now = LocalDateTime.now();

        activeOrders.forEach(order -> handleScheduledUpdate(order, now));
    }

    private void transitionOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        transitionOrderStatus(order, newStatus);
    }

    private void transitionOrderStatus(Order order, OrderStatus newStatus) {
        validateStateTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);
        order.setLastUpdated(LocalDateTime.now());
        orderRepository.save(order);
        orderStatusProducer.sendOrderStatus(order.getOrderId(), newStatus);
        logger.info("Order ID {} status transitioned to {}", order.getOrderId(), newStatus);
    }

    private void validateStateTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        ValidationUtility.validateStateTransition(currentStatus, newStatus);
    }

    private List<Order> filterOrdersByStatus(List<Order> orders, List<String> statusFilters) {
        List<OrderStatus> statuses = statusFilters.stream()
                .map(status -> OrderStatus.valueOf(status.toUpperCase()))
                .collect(Collectors.toList());
        return orders.stream()
                .filter(order -> statuses.contains(order.getStatus()))
                .collect(Collectors.toList());
    }

    private void sortOrders(List<Order> orders, String sortBy, boolean ascending) {
        if ("status".equalsIgnoreCase(sortBy)) {
            orders.sort((o1, o2) -> ascending ? o1.getStatus().compareTo(o2.getStatus())
                    : o2.getStatus().compareTo(o1.getStatus()));
        } else if ("createdDate".equalsIgnoreCase(sortBy)) {
            orders.sort((o1, o2) -> ascending ? o1.getCreatedDate().compareTo(o2.getCreatedDate())
                    : o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        }
    }

    private void handleScheduledUpdate(Order order, LocalDateTime now) {
        LocalDateTime lastUpdated = order.getLastUpdated();
        LocalDateTime fallbackDate = order.getCreatedDate();

        // Fallback to createdDate if lastUpdated is null
        if (lastUpdated == null) {
            logger.warn("Order {} has no lastUpdated timestamp.", order.getOrderId());
            lastUpdated = fallbackDate;

            // If createdDate is also null, log a warning and skip this order
            if (lastUpdated == null) {
                logger.error("Order {} has no lastUpdated or createdDate. Skipping update.", order.getOrderId());
                return;
            }

            logger.warn("Using createdDate as fallback for order {}: {}", order.getOrderId(), lastUpdated);
        }

        long minutesSinceUpdate = java.time.Duration.between(lastUpdated, now).toMinutes();

        switch (order.getStatus()) {
            case ORDER_PLACED:
                if (minutesSinceUpdate > ORDER_PLACED_DELAY_MINUTES) {
                    transitionOrderStatus(order, OrderStatus.ORDER_CANCELLED);
                }
                break;
            case PREPARING:
                if (minutesSinceUpdate > PREPARING_DELAY_MINUTES) {
                    transitionOrderStatus(order, OrderStatus.ORDER_CANCELLED);
                }
                break;
            case ON_THE_WAY:
                if (minutesSinceUpdate > ON_THE_WAY_DELAY_MINUTES) {
                    transitionOrderStatus(order, OrderStatus.ORDER_CANCELLED);
                }
                break;
            default:
                logger.info("Order {} in status {} needs no update.", order.getOrderId(), order.getStatus());
        }
    }



    private RestaurantDto fetchRestaurantDetails(CustomerOrderDto orderDto) {
        int restaurantId = Integer.parseInt(orderDto.getRestaurantId());
        return restaurantService.getRestaurantById(restaurantId);
    }

    private void sendNotifications(CustomerOrderDto orderDto, Order order) {
        String restaurantNotificationMessage = String.format("New order #%s has been placed at your restaurant.", order.getOrderId());
        notificationService.sendNotificationToUser(orderDto.getRestaurantId(), restaurantNotificationMessage);
    }


    public void updateOrderStatus(String orderId, String status) {
        try {
            logger.info("Updating order status. Order ID: {}, New Status: {}", orderId, status);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

            OrderStatus newStatus = OrderStatus.valueOf(status);

            if (order.getStatus().equals(newStatus)) {
                logger.warn("Order ID {} is already in the state: {}. Skipping update.", orderId, newStatus);
                return;
            }

            validateStateTransition(order.getStatus(), newStatus);

            order.setStatus(newStatus);
            order.setLastUpdated(LocalDateTime.now());
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

}
