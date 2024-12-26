package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class RestaurentImpl implements RestaurentService {

    private final RestaurantRepository repository;

    @Override
    public RestaurantDto saveRestaurent(RestaurantDto restaurantDto) {
        System.out.println("Restaurant to save: " + restaurantDto);
        Restaurant restaurant = new Restaurant(
                restaurantDto.getRestaurantName(),
                restaurantDto.getRestaurantEmail(),
                restaurantDto.getRestaurantPassword(),
                restaurantDto.getRestaurantAddress(),
                restaurantDto.getRestaurantPhone(),
                restaurantDto.getRestaurantCity(),
                restaurantDto.getRestaurantLocation(),
                true
        );
        Restaurant savedRestaurant = repository.save(restaurant);
        System.out.println("Restaurant to save: " + restaurant);

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
        Optional<Restaurant> existingRestaurantOpt = repository.findById(restaurantId);
        if (existingRestaurantOpt.isPresent()) {
            Restaurant existingRestaurant = existingRestaurantOpt.get();

            // Update fields
            existingRestaurant.setRestaurantName(restaurantDto.getRestaurantName());
            existingRestaurant.setRestaurantEmail(restaurantDto.getRestaurantEmail());
            existingRestaurant.setRestaurantPassword(restaurantDto.getRestaurantPassword());
            existingRestaurant.setRestaurantAddress(restaurantDto.getRestaurantAddress());
            existingRestaurant.setRestaurantPhone(restaurantDto.getRestaurantPhone());
            existingRestaurant.setRestaurantCity(restaurantDto.getRestaurantCity());
            existingRestaurant.setRestaurantLocation(restaurantDto.getRestaurantLocation());
            existingRestaurant.setActive(restaurantDto.getActive());

            // Save updated restaurant
            Restaurant updatedRestaurant = repository.save(existingRestaurant);

            // Convert to DTO and return
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
        return null; // Return null if restaurant with the given ID doesn't exist
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
