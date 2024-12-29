package com.ISA.Restaurant.Dto.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestMenuItemSaveDto {
    private String menuItemName;
    private String menuItemDescription;
    private Double menuItemPrice;
}
