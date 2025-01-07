package com.ISA.Restaurant.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDto {
    private Long menuItemId;
    private String menuItemName;
    private String menuItemDescription;
    private Double menuItemPrice;
    private Boolean active; // Optional, not needed in this query
    private List<String> imageUrls;

    // Constructor for HQL
    public MenuItemDto(Long menuItemId, String menuItemName, String menuItemDescription, Double menuItemPrice, List<String> imageUrls) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.menuItemDescription = menuItemDescription;
        this.menuItemPrice = menuItemPrice;
        this.imageUrls = imageUrls;
    }
}


