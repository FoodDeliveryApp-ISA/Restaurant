package com.ISA.Restaurant.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyRestaurantDto {
    private String email;
    private String verificationCode;
}
