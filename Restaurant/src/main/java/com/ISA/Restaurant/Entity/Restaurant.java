package com.ISA.Restaurant.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Restaurant implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "restaurant_id", nullable = false)
    private int restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    @NotBlank
    private String restaurantName;

    @Column(name = "restaurant_email", nullable = false)
    @NotBlank
    @Email
    private String restaurantEmail;

    @Column(name = "restaurant_password", nullable = false)
    @NotBlank
    private String restaurantPassword;

    @Column(name = "restaurant_address", nullable = false)
    private String restaurantAddress;

    @Column(name = "restaurant_phone", nullable = false)
    @NotBlank
    private String restaurantPhone;

    @Column(name = "restaurant_city", nullable = false)
    @NotBlank
    private String restaurantCity;

    @Column(name = "restaurant_location")
    private String restaurantLocation;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "active")
    private Boolean active;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Menu> menus;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;

    @Column(name = "enabled" , nullable = false)
    private Boolean enabled = false;

    public Restaurant(
            String restaurantName,
            String restaurantEmail,
            String restaurantPassword,
            String restaurantAddress,
            String restaurantPhone,
            String restaurantCity,
            String restaurantLocation,
            Boolean active,
            String coverImageUrl
    ) {
        this.restaurantName = restaurantName;
        this.restaurantEmail = restaurantEmail;
        this.restaurantPassword = restaurantPassword;
        this.restaurantAddress = restaurantAddress;
        this.restaurantPhone = restaurantPhone;
        this.restaurantCity = restaurantCity;
        this.restaurantLocation = restaurantLocation;
        this.active = active;
        this.enabled = false; // Default to false until verified
        this.coverImageUrl = "";
    }

    public Restaurant(
            String restaurantName,
            String restaurantEmail,
            String restaurantAddress,
            String restaurantPhone,
            String restaurantCity,
            String restaurantLocation,
            Boolean active,
            String coverImageUrl
    )
    {
        this.restaurantName = restaurantName;
        this.restaurantEmail = restaurantEmail;
        this.restaurantAddress = restaurantAddress;
        this.restaurantPhone = restaurantPhone;
        this.restaurantCity = restaurantCity;
        this.restaurantLocation = restaurantLocation;
        this.active = active;
        this.coverImageUrl = coverImageUrl;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
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

    @Override
    public String toString() {
        return "Restaurant{" +
                "id=" + restaurantId +
                ", name='" + restaurantName + '\'' +
                ", email='" + restaurantEmail + '\'' +
                '}';
    }


}
