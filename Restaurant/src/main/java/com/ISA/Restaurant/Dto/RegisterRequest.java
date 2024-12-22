package com.ISA.Restaurant.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String restaurantName;

    private String restaurantEmail;

    private String restaurantPassword;

    private String restaurantAddress;

    private String restaurantPhone;

    private String restaurantCity;

    private String restaurantLocation;

}
