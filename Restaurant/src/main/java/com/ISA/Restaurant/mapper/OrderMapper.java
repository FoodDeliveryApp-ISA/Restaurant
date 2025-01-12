package com.ISA.Restaurant.mapper;

import com.ISA.Restaurant.Dto.Event.CustomerOrderDto;
import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import com.ISA.Restaurant.Entity.Order;

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
}
