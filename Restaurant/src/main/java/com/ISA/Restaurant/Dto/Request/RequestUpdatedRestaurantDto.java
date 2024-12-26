package com.ISA.Restaurant.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdatedRestaurantDto {
    private int restaurantId;

    @NotBlank
    private String restaurantName;

    @Email
    private String restaurantEmail;

    private String restaurantAddress;

    private String restaurantPhone;

    private String restaurantCity;

    private String restaurantLocation;

    private Boolean active;

    private String coverImageUrl; // Allow updating the cover image
}
