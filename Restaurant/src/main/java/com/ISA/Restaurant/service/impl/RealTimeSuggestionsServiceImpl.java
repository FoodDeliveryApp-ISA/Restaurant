package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.repo.MenuItemRepository;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.repo.RestaurantRepository;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.cache.annotation.Cacheable;
import realTimeSuggestion.RealTimeSuggestionsServiceGrpc;
import realTimeSuggestion.RealTimeSuggestionsServiceOuterClass;


import java.util.List;
import java.util.stream.Collectors;

@GrpcService
@Slf4j
public class RealTimeSuggestionsServiceImpl extends RealTimeSuggestionsServiceGrpc.RealTimeSuggestionsServiceImplBase {

    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    public RealTimeSuggestionsServiceImpl(RestaurantRepository restaurantRepository, MenuRepository menuRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
//    @Cacheable(value = "citySuggestionsCache", key = "#request.partialCity + ':' + #request.partialName + ':' + #request.partialMenuItem")
    public void getCitySuggestions(RealTimeSuggestionsServiceOuterClass.CitySuggestionRequest request, StreamObserver<RealTimeSuggestionsServiceOuterClass.CitySuggestionResponse> responseObserver) {
        try {
            String partialCity = request.getPartialCity().trim().toLowerCase();
            String partialName = request.getPartialName().trim().toLowerCase();
            String partialMenuItem = request.getPartialMenuItem().trim().toLowerCase();

            List<String> cities = restaurantRepository.findAll()
                    .stream()
                    .filter(restaurant -> partialCity.isEmpty() || restaurant.getRestaurantCity().toLowerCase().startsWith(partialCity))
                    .filter(restaurant -> partialName.isEmpty() || restaurant.getRestaurantName().toLowerCase().startsWith(partialName))
                    .filter(restaurant -> partialMenuItem.isEmpty() || hasMatchingMenuItem(restaurant.getRestaurantId(), partialMenuItem))
                    .map(com.ISA.Restaurant.Entity.Restaurant::getRestaurantCity)
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            RealTimeSuggestionsServiceOuterClass.CitySuggestionResponse response = RealTimeSuggestionsServiceOuterClass.CitySuggestionResponse.newBuilder()
                    .addAllCities(cities)
                    .build();
            responseObserver.onNext(response);
        } catch (Exception e) {
            log.error("Error fetching city suggestions: {}", e.getMessage(), e);
            responseObserver.onError(new RuntimeException("Internal server error"));
        } finally {
            responseObserver.onCompleted();
        }
    }

    @Override
//    @Cacheable(value = "restaurantNameSuggestionsCache", key = "#request.partialCity + ':' + #request.partialName + ':' + #request.partialMenuItem")
    public void getRestaurantNameSuggestions(RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionRequest request, StreamObserver<RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionResponse> responseObserver) {
        try {
            String partialCity = request.getPartialCity().trim().toLowerCase();
            String partialName = request.getPartialName().trim().toLowerCase();
            String partialMenuItem = request.getPartialMenuItem().trim().toLowerCase();

            List<String> restaurantNames = restaurantRepository.findAll()
                    .stream()
                    .filter(restaurant -> partialCity.isEmpty() || restaurant.getRestaurantCity().toLowerCase().startsWith(partialCity))
                    .filter(restaurant -> partialName.isEmpty() || restaurant.getRestaurantName().toLowerCase().startsWith(partialName))
                    .filter(restaurant -> partialMenuItem.isEmpty() || hasMatchingMenuItem(restaurant.getRestaurantId(), partialMenuItem))
                    .map(com.ISA.Restaurant.Entity.Restaurant::getRestaurantName)
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionResponse response = RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionResponse.newBuilder()
                    .addAllRestaurantNames(restaurantNames)
                    .build();
            responseObserver.onNext(response);
        } catch (Exception e) {
            log.error("Error fetching restaurant name suggestions: {}", e.getMessage(), e);
            responseObserver.onError(new RuntimeException("Internal server error"));
        } finally {
            responseObserver.onCompleted();
        }
    }

    @Override
//    @Cacheable(value = "menuItemSuggestionsCache", key = "#request.partialCity + ':' + #request.partialName + ':' + #request.partialMenuItem")
    public void getMenuItemSuggestions(RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionRequest request, StreamObserver<RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionResponse> responseObserver) {
        try {
            String partialCity = request.getPartialCity().trim().toLowerCase();
            String partialName = request.getPartialName().trim().toLowerCase();
            String partialMenuItem = request.getPartialMenuItem().trim().toLowerCase();

            List<String> menuItems = restaurantRepository.findAll()
                    .stream()
                    .filter(restaurant -> partialCity.isEmpty() || restaurant.getRestaurantCity().toLowerCase().startsWith(partialCity))
                    .filter(restaurant -> partialName.isEmpty() || restaurant.getRestaurantName().toLowerCase().startsWith(partialName))
                    .flatMap(restaurant -> menuRepository.findByRestaurant_RestaurantId(restaurant.getRestaurantId()).stream())
                    .flatMap(menu -> menuItemRepository.findByMenu_MenuId(menu.getMenuId()).stream())
                    .map(com.ISA.Restaurant.Entity.MenuItem::getMenuItemName)
                    .filter(itemName -> partialMenuItem.isEmpty() || itemName.toLowerCase().startsWith(partialMenuItem))
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionResponse response = RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionResponse.newBuilder()
                    .addAllMenuItems(menuItems)
                    .build();
            responseObserver.onNext(response);
        } catch (Exception e) {
            log.error("Error fetching menu item suggestions: {}", e.getMessage(), e);
            responseObserver.onError(new RuntimeException("Internal server error"));
        } finally {
            responseObserver.onCompleted();
        }
    }


    private boolean hasMatchingMenuItem(Integer restaurantId, String menuItemFilter) {
        return menuRepository.findByRestaurant_RestaurantId(restaurantId)
                .stream()
                .flatMap(menu -> menuItemRepository.findByMenu_MenuId(menu.getMenuId()).stream())
                .anyMatch(menuItem -> menuItem.getMenuItemName().toLowerCase().contains(menuItemFilter));
    }
}
