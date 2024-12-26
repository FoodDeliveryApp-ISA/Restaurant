package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class RestaurantImpl implements RestaurantService {

    private final RestaurantRepository repository;

    private Restaurant mapDtoToEntity(RestaurantDto dto) {
        return new Restaurant(
                dto.getRestaurantName(),
                dto.getRestaurantEmail(),
                dto.getRestaurantAddress(),
                dto.getRestaurantPhone(),
                dto.getRestaurantCity(),
                dto.getRestaurantLocation(),
                dto.getActive(),
                dto.getCoverImageUrl()
        );
    }

    private RestaurantDto mapEntityToDto(Restaurant entity) {
        return new RestaurantDto(
                entity.getRestaurantId(),
                entity.getRestaurantName(),
                entity.getRestaurantEmail(),
                entity.getRestaurantAddress(),
                entity.getRestaurantPhone(),
                entity.getRestaurantCity(),
                entity.getRestaurantLocation(),
                entity.getActive(),
                entity.getCoverImageUrl()
        );
    }

    @Override
    public RestaurantDto saveRestaurant(RestaurantDto restaurantDto) {
        Restaurant restaurant = mapDtoToEntity(restaurantDto);
        Restaurant savedRestaurant = repository.save(restaurant);
        return mapEntityToDto(savedRestaurant);
    }

    @Override
    public RestaurantDto getRestaurantById(int restaurantId) {
        return repository.findById(restaurantId)
                .map(this::mapEntityToDto)
                .orElse(null); // return null if not found
    }

    @Override
    public RestaurantDto findByRestaurantEmail(String email) {
        return repository.findByRestaurantEmail(email)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    @Override
    public RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto) {
        if (repository.existsById(restaurantId)) {
            Restaurant restaurant = mapDtoToEntity(restaurantDto);
            restaurant.setRestaurantId(restaurantId); // Ensure ID is retained
            Restaurant updatedRestaurant = repository.save(restaurant);
            return mapEntityToDto(updatedRestaurant);
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
        return StreamSupport.stream(restaurants.spliterator(), false)
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
}
