package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Response.SearchResponseDto;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import restaurant.SearchServiceGrpc;
import restaurant.SearchServiceOuterClass;

@Slf4j
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchServiceGrpc.SearchServiceBlockingStub searchServiceBlockingStub;

    public SearchController(SearchServiceGrpc.SearchServiceBlockingStub searchServiceBlockingStub) {
        this.searchServiceBlockingStub = searchServiceBlockingStub;
    }

    @GetMapping
    public SearchResponseDto searchRestaurants(
            @RequestParam(value = "restaurantName", required = false) String restaurantName,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "menuItem", required = false) String menuItem) {

        // Build gRPC request
        SearchServiceOuterClass.SearchRequest grpcRequest = SearchServiceOuterClass.SearchRequest.newBuilder()
                .setRestaurantName(restaurantName != null ? restaurantName : "")
                .setCity(city != null ? city : "")
                .setMenuItem(menuItem != null ? menuItem : "")
                .build();

        // Call gRPC service
        SearchServiceOuterClass.SearchResponse grpcResponse = searchServiceBlockingStub.searchRestaurants(grpcRequest);

        // Convert gRPC response to DTO
        return new SearchResponseDto(grpcResponse.getSummariesList());
    }

@PostConstruct
    public void init() {
        if (searchServiceBlockingStub == null) {
            log.error("searchServiceBlockingStub is not initialized.");
        } else {
            log.info("searchServiceBlockingStub initialized successfully.");
        }
    }
}


