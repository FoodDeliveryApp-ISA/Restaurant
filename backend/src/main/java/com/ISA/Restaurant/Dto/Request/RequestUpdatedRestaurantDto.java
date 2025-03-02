package com.ISA.Restaurant.Dto.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestUpdatedRestaurantDto {
    private String restaurantName;
    private String restaurantEmail;
    private String restaurantPassword;
    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantCity;
    private String restaurantLocation;
    private Boolean active;
    private String coverImageUrl;
}
