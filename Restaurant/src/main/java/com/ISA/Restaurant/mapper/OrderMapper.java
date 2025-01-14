package com.ISA.Restaurant.mapper;

import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Order;
import com.ISA.Restaurant.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static Order toEntity(CustomerOrderDto dto) {
        return new Order(
                dto.getOrderId(),
                dto.getCustomerLocation(),
                dto.getRestaurantId(),
                dto.getCustomerName(),
                dto.getCustomerAddress(),
                dto.getCustomerPhone()
//                dto.getItems()
        );
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
                order.getCustomerPhone()
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
}
