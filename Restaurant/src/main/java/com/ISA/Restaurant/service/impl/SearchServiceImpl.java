package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.repo.MenuItemRepository;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.repo.RestaurantRepository;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.data.redis.core.RedisTemplate;
import restaurant.Restaurant;
import restaurant.SearchServiceOuterClass;


import java.util.List;
import java.util.stream.Collectors;

@GrpcService
@Slf4j
public class SearchServiceImpl extends restaurant.SearchServiceGrpc.SearchServiceImplBase {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    public SearchServiceImpl(RestaurantRepository restaurantRepository,
                             MenuRepository menuRepository,
                             MenuItemRepository menuItemRepository,
                             RedisTemplate<String, Object> redisTemplate) {
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
        this.menuItemRepository = menuItemRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void searchRestaurants(SearchServiceOuterClass.SearchRequest request, StreamObserver<SearchServiceOuterClass.SearchResponse> responseObserver) {
        String cacheKey = String.format("search:%s:%s:%s",
                request.getCity().trim().toLowerCase(),
                request.getRestaurantName().trim().toLowerCase(),
                request.getMenuItem().trim().toLowerCase());

        SearchServiceOuterClass.SearchResponse cachedResponse = (SearchServiceOuterClass.SearchResponse) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            responseObserver.onNext(cachedResponse);
            responseObserver.onCompleted();
            return;
        }

        log.info("Cache miss for key: {}", cacheKey);
        try {
            String cityFilter = request.getCity().trim().toLowerCase();
            String nameFilter = request.getRestaurantName().trim().toLowerCase();
            String menuItemFilter = request.getMenuItem().trim().toLowerCase();

            // Filter restaurants based on criteria
            List<Restaurant.RestaurantSummary> matchingRestaurants = restaurantRepository.findAll()
                    .stream()
                    .filter(restaurant -> cityFilter.isEmpty() || restaurant.getRestaurantCity().toLowerCase().contains(cityFilter))
                    .filter(restaurant -> nameFilter.isEmpty() || restaurant.getRestaurantName().toLowerCase().contains(nameFilter))
                    .filter(restaurant -> menuItemFilter.isEmpty() || matchesMenuItem(restaurant.getRestaurantId(), menuItemFilter))
                    .map(this::mapToRestaurantSummary)
                    .collect(Collectors.toList());

            // Build and send the response
            SearchServiceOuterClass.SearchResponse response = SearchServiceOuterClass.SearchResponse.newBuilder()
                    .addAllSummaries(matchingRestaurants)
                    .build();
            responseObserver.onNext(response);

        } catch (Exception e) {
            log.error("Error searching restaurants: {}", e.getMessage(), e);
            responseObserver.onError(new RuntimeException("Internal server error"));
        } finally {
            responseObserver.onCompleted();
        }
    }


    private boolean matchesMenuItem(Integer restaurantId, String menuItemFilter) {
        return menuRepository.findByRestaurant_RestaurantId(restaurantId)
                .stream()
                .flatMap(menu -> menuItemRepository.findByMenu_MenuId(menu.getMenuId()).stream())
                .anyMatch(menuItem -> menuItem.getMenuItemName().toLowerCase().contains(menuItemFilter));
    }


    private Restaurant.RestaurantSummary mapToRestaurantSummary(com.ISA.Restaurant.Entity.Restaurant restaurant) {
        return Restaurant.RestaurantSummary.newBuilder()
                .setRestaurantId(restaurant.getRestaurantId())
                .setRestaurantName(restaurant.getRestaurantName())
                .setRestaurantCity(restaurant.getRestaurantCity())
                .setCoverImageUrl(restaurant.getCoverImageUrl() != null ? restaurant.getCoverImageUrl() : "")
                .build();
    }
}
