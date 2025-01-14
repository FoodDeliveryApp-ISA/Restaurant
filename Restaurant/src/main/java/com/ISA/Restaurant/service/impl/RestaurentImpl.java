package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.Request.RegisterRequest;
//import com.ISA.Restaurant.Dto.
import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.exception.RestaurantNotFoundException;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@AllArgsConstructor
public class RestaurentImpl implements RestaurentService {

    private static final String RESTAURANT_CACHE = "restaurants";
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
        @Cacheable(value = RESTAURANT_CACHE, key = "#restaurantId")
        public RestaurantDto getRestaurantById(int restaurantId) {
            try {
                return repository.findById(restaurantId)
                        .map(this::mapEntityToDto)
                        .orElseThrow(() -> new RestaurantNotFoundException(
                                "Restaurant with ID " + restaurantId + " not found."));
            } catch (Exception e) {
                log.error("Error retrieving restaurant by ID: {}", restaurantId, e);
                throw e; // Re-throwing allows centralized handling in @ControllerAdvice.
            }
        }

        @Override
        @Cacheable(value = RESTAURANT_CACHE, key = "#email")
        public RestaurantDto findByRestaurentEmail(String email) {
            try {
                return repository.findByRestaurantEmail(email)
                        .map(this::mapEntityToDto)
                        .orElseThrow(() -> new RestaurantNotFoundException(
                                "Restaurant with email " + email + " not found."));
            } catch (Exception e) {
                log.error("Error retrieving restaurant by email: {}", email, e);
                throw e;
            }
        }

        @Override
        @CachePut(value = RESTAURANT_CACHE, key = "#restaurantId")
        public RestaurantDto updateRestaurant(int restaurantId, RestaurantDto restaurantDto) {
            validateRestaurantDto(restaurantDto);

            try {
                Restaurant existingRestaurant = repository.findById(restaurantId)
                        .orElseThrow(() -> new RestaurantNotFoundException(
                                "Restaurant with ID " + restaurantId + " not found."));

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
            } catch (Exception e) {
                log.error("Error updating restaurant ID: {}, Data: {}", restaurantId, restaurantDto, e);
                throw e;
            }
        }

        @Override
        @CacheEvict(value = RESTAURANT_CACHE, key = "#restaurantId")
        public boolean deleteRestaurant(int restaurantId) {
            try {
                if (repository.existsById(restaurantId)) {
                    repository.deleteById(restaurantId);
                    return true;
                }
                throw new RestaurantNotFoundException("Restaurant with ID " + restaurantId + " not found.");
            } catch (Exception e) {
                log.error("Error deleting restaurant ID: {}", restaurantId, e);
                throw e;
            }
        }

        @Override
        @Cacheable(value = RESTAURANT_CACHE, key = "'all'")
        public Iterable<RestaurantDto> getAllRestaurants() {
            try {
                Iterable<Restaurant> restaurants = repository.findAll();
                return StreamSupport.stream(restaurants.spliterator(), false)
                        .map(this::mapEntityToDto)
                        .collect(Collectors.toList());
            } catch (Exception e) {
                log.error("Error retrieving all restaurants", e);
                throw e;
            }
        }

        private void validateRestaurantDto(RestaurantDto restaurantDto) {
            if (restaurantDto.getRestaurantEmail() == null
                    || !restaurantDto.getRestaurantEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                log.error("Invalid email format: {}", restaurantDto.getRestaurantEmail());
                throw new IllegalArgumentException("Invalid email format.");
            }
        }
    }
