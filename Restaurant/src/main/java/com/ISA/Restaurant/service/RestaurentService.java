package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.Request.RegisterRequest;
import com.ISA.Restaurant.Dto.RestaurantDto;

public interface RestaurentService {
    RestaurantDto saveRestaurent(RegisterRequest registerRequest);

    RestaurantDto getRestaurantById(int restaurantId);

    RestaurantDto findByRestaurentEmail(String email);

    RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto);

    boolean deleteRestaurant(int restaurantId);

    Iterable<RestaurantDto> getAllRestaurants();

}
