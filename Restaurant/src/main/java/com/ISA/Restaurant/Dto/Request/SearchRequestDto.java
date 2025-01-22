package com.ISA.Restaurant.Dto.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequestDto {
    private String restaurantName;
    private String city;
    private String menuItem;
}