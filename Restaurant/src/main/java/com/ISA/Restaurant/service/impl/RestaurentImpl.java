package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.Request.RegisterRequest;
//import com.ISA.Restaurant.Dto.
import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.exception.RestaurantNotFoundException;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class RestaurentImpl implements RestaurentService {

    private final RestaurantRepository repository;

    private Restaurant mapDtoToEntity(RestaurantDto dto) {
        return new Restaurant
                (
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
    public RestaurantDto getRestaurantById(int restaurantId) {
        return repository.findById(restaurantId)
                .map(this::mapEntityToDto)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant with ID " + restaurantId + " not found."));
    }

    @Override
    public RestaurantDto findByRestaurentEmail(String email) {
        return repository.findByRestaurantEmail(email)
                .map(this::mapEntityToDto)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant with email " + email + " not found."));
    }

    @Override
    public RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto) {
        // Validate restaurantDto fields (e.g., check email format, non-null fields)
        validateRestaurantDto(restaurantDto);

        Restaurant existingRestaurant = repository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant with ID " + restaurantId + " not found."));

        // Update fields
        existingRestaurant.setRestaurantName(restaurantDto.getRestaurantName());
        existingRestaurant.setRestaurantEmail(restaurantDto.getRestaurantEmail());
        existingRestaurant.setRestaurantAddress(restaurantDto.getRestaurantAddress());
        existingRestaurant.setRestaurantPhone(restaurantDto.getRestaurantPhone());
        existingRestaurant.setRestaurantCity(restaurantDto.getRestaurantCity());
        existingRestaurant.setRestaurantLocation(restaurantDto.getRestaurantLocation());
        existingRestaurant.setActive(restaurantDto.getActive());
        existingRestaurant.setCoverImageUrl(restaurantDto.getCoverImageUrl());

        // Save updated restaurant
        Restaurant updatedRestaurant = repository.save(existingRestaurant);

        return mapEntityToDto(updatedRestaurant);
    }



    @Override
    public boolean deleteRestaurant(int restaurantId) {
        if (repository.existsById(restaurantId)) {
            repository.deleteById(restaurantId);
            return true;
        }
        throw new RestaurantNotFoundException("Restaurant with ID " + restaurantId + " not found.");
    }


    @Override
    public Iterable<RestaurantDto> getAllRestaurants() {
        Iterable<Restaurant> restaurants = repository.findAll();

        // Use StreamSupport to convert Iterable to Stream and map entities to DTOs
        return StreamSupport.stream(restaurants.spliterator(), false)
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    // Validation method
    private void validateRestaurantDto(RestaurantDto restaurantDto) {
        if (restaurantDto.getRestaurantEmail() == null || !restaurantDto.getRestaurantEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format.");
        }
}
