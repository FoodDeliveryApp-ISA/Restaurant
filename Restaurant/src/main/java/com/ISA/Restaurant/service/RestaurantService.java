package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.RestaurantDto;

public interface RestaurantService {

    /**
     * Save a new restaurant.
     *
     * @param restaurantDto the RestaurantDto object containing restaurant data.
     * @return the saved RestaurantDto.
     */
    RestaurantDto saveRestaurant(RestaurantDto restaurantDto);

    /**
     * Get a restaurant by its ID.
     *
     * @param restaurantId the ID of the restaurant.
     * @return the RestaurantDto for the given ID, or null if not found.
     */
    RestaurantDto getRestaurantById(int restaurantId);

    /**
     * Find a restaurant by its email.
     *
     * @param email the email of the restaurant.
     * @return the RestaurantDto matching the given email, or null if not found.
     */
    RestaurantDto findByRestaurantEmail(String email);

    /**
     * Update an existing restaurant by its ID.
     *
     * @param restaurantId the ID of the restaurant to update.
     * @param restaurantDto the RestaurantDto object containing updated data.
     * @return the updated RestaurantDto, or null if the restaurant does not exist.
     */
    RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto);

    /**
     * Delete a restaurant by its ID.
     *
     * @param restaurantId the ID of the restaurant to delete.
     * @return true if the restaurant was successfully deleted, false otherwise.
     */
    boolean deleteRestaurant(int restaurantId);

    /**
     * Get all restaurants.
     *
     * @return an iterable list of all RestaurantDto objects.
     */
    Iterable<RestaurantDto> getAllRestaurants();
}
