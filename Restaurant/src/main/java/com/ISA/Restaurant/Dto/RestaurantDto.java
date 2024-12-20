package com.ISA.Restaurant.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDto {

    private int restaurantId;  // Change this from long to int

    private String restaurantName;

    private String restaurantEmail;

    private String restaurantPassword;

    private String restaurantAddress;

    private String restaurantPhone;

    private String restaurantCity;

    private String restaurantLocation;

    private Boolean active;

}
