package com.ISA.Restaurant.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdatedMenuItemDto {
    private Long menuItemId;
    private String menuItemName;
    private String menuItemDescription;
    private Double menuItemPrice;
    private Boolean active;
    private List<String> imageUrls;
}
