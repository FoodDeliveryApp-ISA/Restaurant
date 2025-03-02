package com.ISA.Restaurant.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String restaurantName;

    @NotBlank
    @Email
    private String restaurantEmail;

    @NotBlank
    private String restaurantPassword;

    @NotBlank
    private String restaurantAddress;

    @NotBlank
    private String restaurantPhone;

    @NotBlank
    private String restaurantCity;

    private String restaurantLocation;

    private Boolean active = true;

    private String coverImageUrl;
}

