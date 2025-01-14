package com.ISA.Restaurant.Dto.Response;

import restaurant.Restaurant;

import java.util.List;
import java.util.stream.Collectors;

public class SearchResponseDto {
    private List<RestaurantSummaryDto> summaries;

    public SearchResponseDto(List<Restaurant.RestaurantSummary> summaries) {
        this.summaries = summaries.stream()
                .map(RestaurantSummaryDto::new)
                .collect(Collectors.toList());
    }

    public List<RestaurantSummaryDto> getSummaries() {
        return summaries;
    }

    public void setSummaries(List<RestaurantSummaryDto> summaries) {
        this.summaries = summaries;
    }
}
