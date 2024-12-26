package com.ISA.Restaurant.Entity;

import com.ISA.Restaurant.Dto.Request.RequestUpdatedRestaurantDto;
import com.ISA.Restaurant.Dto.RegisterRequest;
import com.ISA.Restaurant.Dto.RestaurantDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Data
@NoArgsConstructor
public class Restaurant implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "restaurant_id", nullable = false)
    private int restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    @NotBlank
    private String restaurantName;

    @Column(name = "restaurant_email", nullable = false, unique = true)
    @NotBlank
    @Email
    private String restaurantEmail;

    @Column(name = "restaurant_password", nullable = false)
    @NotBlank
    private String restaurantPassword;

    @Column(name = "restaurant_address")
    private String restaurantAddress;

    @Column(name = "restaurant_phone")
    private String restaurantPhone;

    @Column(name = "restaurant_city")
    private String restaurantCity;

    @Column(name = "restaurant_location")
    private String restaurantLocation;

    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled = false;

    // Constructor for RegisterRequest
    public Restaurant(RegisterRequest registerRequest) {
        this.restaurantName = registerRequest.getRestaurantName();
        this.restaurantEmail = registerRequest.getRestaurantEmail();
        this.restaurantPassword = registerRequest.getRestaurantPassword();
        this.restaurantAddress = registerRequest.getRestaurantAddress();
        this.restaurantPhone = registerRequest.getRestaurantPhone();
        this.restaurantCity = registerRequest.getRestaurantCity();
        this.restaurantLocation = registerRequest.getRestaurantLocation();
        this.active = false; // Default to inactive on registration
        this.enabled = true; // Default to enabled
    }

    public Restaurant(
            @NotBlank String restaurantName,
            @NotBlank @Email String restaurantEmail,
            String restaurantAddress,
            String restaurantPhone,
            String restaurantCity,
            String restaurantLocation,
            Boolean active,
            String coverImageUrl
    ) {
        this.restaurantName = restaurantName;
        this.restaurantEmail = restaurantEmail;
        this.restaurantAddress = restaurantAddress;
        this.restaurantPhone = restaurantPhone;
        this.restaurantCity = restaurantCity;
        this.restaurantLocation = restaurantLocation;
        this.active = active;
        this.coverImageUrl = coverImageUrl;
    }

    // Method to update from RequestUpdatedRestaurantDto
    public void updateFromDto(RequestUpdatedRestaurantDto dto) {
        this.restaurantName = dto.getRestaurantName();
        this.restaurantEmail = dto.getRestaurantEmail();
        this.restaurantAddress = dto.getRestaurantAddress();
        this.restaurantPhone = dto.getRestaurantPhone();
        this.restaurantCity = dto.getRestaurantCity();
        this.restaurantLocation = dto.getRestaurantLocation();
        this.active = dto.getActive();
        this.coverImageUrl = dto.getCoverImageUrl();
    }

    // Method to convert to RestaurantDto
    public RestaurantDto toDto() {
        return new RestaurantDto(
                this.restaurantId,
                this.restaurantName,
                this.restaurantEmail,
                this.restaurantAddress,
                this.restaurantPhone,
                this.restaurantCity,
                this.restaurantLocation,
                this.active,
                this.coverImageUrl,
                this.enabled
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return this.restaurantPassword;
    }

    @Override
    public String getUsername() {
        return this.restaurantEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}


