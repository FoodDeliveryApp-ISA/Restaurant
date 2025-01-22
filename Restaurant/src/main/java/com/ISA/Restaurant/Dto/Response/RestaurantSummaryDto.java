package com.ISA.Restaurant.Dto.Response;

import lombok.Getter;
import lombok.Setter;
import restaurant.Restaurant;

@Getter
@Setter
public class RestaurantSummaryDto {
    private int restaurantId;
    private String restaurantName;
    private String restaurantCity;
    private String coverImageUrl;

    public RestaurantSummaryDto(Restaurant.RestaurantSummary summary) {
        this.restaurantId = summary.getRestaurantId();
        this.restaurantName = summary.getRestaurantName();
        this.restaurantCity = summary.getRestaurantCity();
        this.coverImageUrl = summary.getCoverImageUrl();
    }

}
