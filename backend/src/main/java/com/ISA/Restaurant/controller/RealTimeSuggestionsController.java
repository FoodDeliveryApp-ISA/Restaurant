package com.ISA.Restaurant.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import realTimeSuggestion.RealTimeSuggestionsServiceGrpc;
import realTimeSuggestion.RealTimeSuggestionsServiceOuterClass;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/suggestions")
public class RealTimeSuggestionsController {

    private final RealTimeSuggestionsServiceGrpc.RealTimeSuggestionsServiceBlockingStub suggestionsServiceStub;

    @Autowired
    public RealTimeSuggestionsController(RealTimeSuggestionsServiceGrpc.RealTimeSuggestionsServiceBlockingStub suggestionsServiceStub) {
        this.suggestionsServiceStub = suggestionsServiceStub;
    }

    @GetMapping("/cities")
    public List<String> getCitySuggestions(
            @RequestParam(value = "partialCity", required = false) String partialCity,
            @RequestParam(value = "partialName", required = false) String partialName,
            @RequestParam(value = "partialMenuItem", required = false) String partialMenuItem) {

        RealTimeSuggestionsServiceOuterClass.CitySuggestionRequest request =
                RealTimeSuggestionsServiceOuterClass.CitySuggestionRequest.newBuilder()
                        .setPartialCity(partialCity != null ? partialCity : "")
                        .setPartialName(partialName != null ? partialName : "")
                        .setPartialMenuItem(partialMenuItem != null ? partialMenuItem : "")
                        .build();

        RealTimeSuggestionsServiceOuterClass.CitySuggestionResponse response =
                suggestionsServiceStub.getCitySuggestions(request);

        return response.getCitiesList();
    }

    @GetMapping("/restaurants")
    public List<String> getRestaurantNameSuggestions(
            @RequestParam(value = "partialCity", required = false) String partialCity,
            @RequestParam(value = "partialName", required = false) String partialName,
            @RequestParam(value = "partialMenuItem", required = false) String partialMenuItem) {

        RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionRequest request =
                RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionRequest.newBuilder()
                        .setPartialCity(partialCity != null ? partialCity : "")
                        .setPartialName(partialName != null ? partialName : "")
                        .setPartialMenuItem(partialMenuItem != null ? partialMenuItem : "")
                        .build();

        RealTimeSuggestionsServiceOuterClass.RestaurantNameSuggestionResponse response =
                suggestionsServiceStub.getRestaurantNameSuggestions(request);

        return response.getRestaurantNamesList();
    }

    @GetMapping("/menu-items")
    public List<String> getMenuItemSuggestions(
            @RequestParam(value = "partialCity", required = false) String partialCity,
            @RequestParam(value = "partialName", required = false) String partialName,
            @RequestParam(value = "partialMenuItem", required = false) String partialMenuItem) {

        RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionRequest request =
                RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionRequest.newBuilder()
                        .setPartialCity(partialCity != null ? partialCity : "")
                        .setPartialName(partialName != null ? partialName : "")
                        .setPartialMenuItem(partialMenuItem != null ? partialMenuItem : "")
                        .build();

        RealTimeSuggestionsServiceOuterClass.MenuItemSuggestionResponse response =
                suggestionsServiceStub.getMenuItemSuggestions(request);

        return response.getMenuItemsList();
    }
}
