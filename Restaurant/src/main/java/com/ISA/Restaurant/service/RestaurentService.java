package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.RestaurantDto;

public interface RestaurentService {
    RestaurantDto saveRestaurent(RestaurantDto restaurantDto);

    RestaurantDto getRestaurantById(int restaurantId);

    RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto);

    boolean deleteRestaurant(int restaurantId);

    Iterable<RestaurantDto> getAllRestaurants();
}
