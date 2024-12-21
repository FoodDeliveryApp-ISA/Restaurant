package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class RestaurentImpl implements RestaurentService {

    private final RestaurantRepository repository;

    @Override
    public RestaurantDto saveRestaurent(RestaurantDto restaurantDto) {
        Restaurant restaurant = new Restaurant(
                restaurantDto.getRestaurantId(),
                restaurantDto.getRestaurantName(),
                restaurantDto.getRestaurantEmail(),
                restaurantDto.getRestaurantPassword(),
                restaurantDto.getRestaurantAddress(),
                restaurantDto.getRestaurantPhone(),
                restaurantDto.getRestaurantCity(),
                restaurantDto.getRestaurantLocation(),
                restaurantDto.getActive()
        );
        Restaurant savedRestaurant = repository.save(restaurant);

        return new RestaurantDto(
                savedRestaurant.getRestaurantId(),
                savedRestaurant.getRestaurantName(),
                savedRestaurant.getRestaurantEmail(),
                savedRestaurant.getRestaurantPassword(),
                savedRestaurant.getRestaurantAddress(),
                savedRestaurant.getRestaurantPhone(),
                savedRestaurant.getRestaurantCity(),
                savedRestaurant.getRestaurantLocation(),
                savedRestaurant.getActive()
        );
    }

    @Override
    public RestaurantDto getRestaurantById(int restaurantId) {
        return repository.findById(restaurantId)
                .map(restaurant -> new RestaurantDto(
                        restaurant.getRestaurantId(),
                        restaurant.getRestaurantName(),
                        restaurant.getRestaurantEmail(),
                        restaurant.getRestaurantPassword(),
                        restaurant.getRestaurantAddress(),
                        restaurant.getRestaurantPhone(),
                        restaurant.getRestaurantCity(),
                        restaurant.getRestaurantLocation(),
                        restaurant.getActive()
                ))
                .orElse(null); // return null if not found
    }

    @Override
    public RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto) {
        if (repository.existsById(restaurantId)) {
            Restaurant restaurant = new Restaurant(
                    restaurantId,
                    restaurantDto.getRestaurantName(),
                    restaurantDto.getRestaurantEmail(),
                    restaurantDto.getRestaurantPassword(),
                    restaurantDto.getRestaurantAddress(),
                    restaurantDto.getRestaurantPhone(),
                    restaurantDto.getRestaurantCity(),
                    restaurantDto.getRestaurantLocation(),
                    restaurantDto.getActive()
            );
            Restaurant updatedRestaurant = repository.save(restaurant);
            return new RestaurantDto(
                    updatedRestaurant.getRestaurantId(),
                    updatedRestaurant.getRestaurantName(),
                    updatedRestaurant.getRestaurantEmail(),
                    updatedRestaurant.getRestaurantPassword(),
                    updatedRestaurant.getRestaurantAddress(),
                    updatedRestaurant.getRestaurantPhone(),
                    updatedRestaurant.getRestaurantCity(),
                    updatedRestaurant.getRestaurantLocation(),
                    updatedRestaurant.getActive()
            );
        }
        return null; // return null if not found
    }

    @Override
    public boolean deleteRestaurant(int restaurantId) {
        if (repository.existsById(restaurantId)) {
            repository.deleteById(restaurantId);
            return true;
        }
        return false; // return false if restaurant does not exist
    }

    @Override
    public Iterable<RestaurantDto> getAllRestaurants() {
        Iterable<Restaurant> restaurants = repository.findAll();
        // Use StreamSupport to convert Iterable to Stream
        return StreamSupport.stream(restaurants.spliterator(), false)
                .map(restaurant -> new RestaurantDto(
                        restaurant.getRestaurantId(),
                        restaurant.getRestaurantName(),
                        restaurant.getRestaurantEmail(),
                        restaurant.getRestaurantPassword(),
                        restaurant.getRestaurantAddress(),
                        restaurant.getRestaurantPhone(),
                        restaurant.getRestaurantCity(),
                        restaurant.getRestaurantLocation(),
                        restaurant.getActive()
                ))
                .collect(Collectors.toList());
    }
}
