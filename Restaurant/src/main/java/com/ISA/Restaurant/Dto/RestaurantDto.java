package com.ISA.Restaurant.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantDto {
    private int restaurantId;

    private String restaurantName;

    private String restaurantEmail;

    private String restaurantAddress;

    private String restaurantPhone;

    private String restaurantCity;

    private String restaurantLocation;

    private Boolean active;

    private String coverImageUrl;

    public RestaurantDto(
            int restaurantId,
            @NotBlank String restaurantName,
            @NotBlank @Email String restaurantEmail,
            String restaurantAddress,
            @NotBlank String restaurantPhone,
            @NotBlank String restaurantCity,
            String restaurantLocation,
            Boolean active,
            String coverImageUrl
    )
    {
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.restaurantEmail = restaurantEmail;
        this.restaurantAddress = restaurantAddress;
        this.restaurantPhone = restaurantPhone;
        this.restaurantCity = restaurantCity;
        this.restaurantLocation = restaurantLocation;
        this.active = active;
        this.coverImageUrl = coverImageUrl;
    }
}