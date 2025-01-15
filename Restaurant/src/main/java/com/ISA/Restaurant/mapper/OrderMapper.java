package com.ISA.Restaurant.mapper;

import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
import com.ISA.Restaurant.Dto.Event.OrderItemDto;
import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Order;
import com.ISA.Restaurant.Entity.OrderItem;
import com.ISA.Restaurant.enums.OrderStatus;
import com.ISA.Restaurant.repo.MenuItemRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OrderMapper {

    private static MenuItemRepository menuItemRepository;

    public OrderMapper(MenuItemRepository menuItemRepository) {
        OrderMapper.menuItemRepository = menuItemRepository;
    }

    // Maps CustomerOrderDto to Order Entity
    public static Order toEntity(CustomerOrderDto dto) {
        Order order = new Order();
        order.setOrderId(dto.getOrderId());
        order.setCustomerLocation(dto.getCustomerLocation());
        order.setRestaurantId(dto.getRestaurantId());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerAddress(dto.getCustomerAddress());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setOrderItems(mapOrderItems(dto.getOrderItems(), order));
        order.setPaymentAmount(calculateTotalPrice(dto.getOrderItems(), dto.getRestaurantId()));
        return order;
    }

    public static Order createOrderEntity(CustomerOrderDto orderDto, RestaurantDto restaurantDetails) {
        Order order = toEntity(orderDto);
        order.setRestaurantId(orderDto.getRestaurantId());
        order.setRestaurantName(restaurantDetails.getRestaurantName());
        order.setRestaurantAddress(restaurantDetails.getRestaurantAddress());
        order.setRestaurantPhone(restaurantDetails.getRestaurantPhone());
        order.setRestaurantLocation(convertStringToList(restaurantDetails.getRestaurantLocation()));
        order.setStatus(OrderStatus.ORDER_PLACED);
        order.setCreatedDate(LocalDateTime.now());
        order.setLastUpdated(LocalDateTime.now());
        return order;
    }

    public static RiderRequestDto toRiderRequestDto(Order order) {
        return new RiderRequestDto(
                order.getOrderId(),
                order.getRestaurantLocation(),
                order.getCustomerLocation(),
                order.getRestaurantName(),
                order.getRestaurantAddress(),
                order.getRestaurantPhone(),
                order.getCustomerName(),
                order.getCustomerAddress(),
                order.getCustomerPhone(),
                order.getPaymentAmount()
        );
    }

    private static List<Double> convertStringToList(String locationString) {
        try {
            return Arrays.stream(locationString.split(","))
                    .map(Double::parseDouble)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid location format: " + locationString, e);
        }
    }

    private static List<OrderItem> mapOrderItems(List<OrderItemDto> orderItemDtos, Order order) {
        if (orderItemDtos == null) {
            return List.of();
        }
        return orderItemDtos.stream()
                .map(dto -> new OrderItem(null, dto.getMenuItemId(), dto.getQuantity(), order))
                .collect(Collectors.toList());
    }

    private static Double calculateTotalPrice(List<OrderItemDto> orderItems, String restaurantId) {
        if (orderItems == null || orderItems.isEmpty()) {
            log.info("No order items provided. Total price is 0.0");
            return 0.0;
        }

        Long parsedRestaurantId;
        try {
            parsedRestaurantId = Long.parseLong(restaurantId);
        } catch (NumberFormatException e) {
            log.error("Invalid restaurantId: {}", restaurantId, e);
            throw new IllegalArgumentException("Invalid restaurantId: " + restaurantId, e);
        }

        return orderItems.stream()
                .mapToDouble(item -> {
                    try {
                        Long menuItemId = Long.parseLong(item.getMenuItemId());
                        var menuItem = menuItemRepository.findByMenuItemId(menuItemId);
                        if (menuItem == null) {
                            log.error("MenuItem not found: {} for restaurantId: {}", item.getMenuItemId(), restaurantId);
                            return 0.0; // Ignore this item in the total calculation
                        }
                        return menuItem.getMenuItemPrice() * item.getQuantity();
                    } catch (NumberFormatException e) {
                        log.error("Invalid menuItemId: {}", item.getMenuItemId(), e);
                        return 0.0; // Ignore invalid menuItemId
                    }
                })
                .sum();
    }

}
