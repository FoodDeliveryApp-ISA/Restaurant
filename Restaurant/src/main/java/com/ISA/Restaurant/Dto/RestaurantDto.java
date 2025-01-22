package com.ISA.Restaurant.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Builder
@Getter
@Setter
public class RestaurantDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L; // Unique identifier for serialization

    private int restaurantId;

    @NotBlank
    private String restaurantName;

    @NotBlank
    @Email
    private String restaurantEmail;

    private String restaurantAddress;

    @NotBlank
    private String restaurantPhone;

    @NotBlank
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
    ) {
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
