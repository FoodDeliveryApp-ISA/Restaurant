package com.ISA.Restaurant.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDto {
    private int restaurantId;

    @NotBlank
    private String restaurantName;

    @NotBlank
    @Email
    private String restaurantEmail;

    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantCity;
    private String restaurantLocation;
    private Boolean active;
    private String coverImageUrl;
    private Boolean enabled; // Optionally include if needed for client

    // Constructor without 'enabled' for flexibility
    public RestaurantDto(int restaurantId,
                         @NotBlank String restaurantName,
                         @NotBlank @Email String restaurantEmail,
                         String restaurantAddress,
                         String restaurantPhone,
                         String restaurantCity,
                         String restaurantLocation,
                         Boolean active,
                         String coverImageUrl) {
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
