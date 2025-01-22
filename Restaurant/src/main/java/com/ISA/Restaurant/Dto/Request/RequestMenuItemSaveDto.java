package com.ISA.Restaurant.Dto.Request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
public class RequestMenuItemSaveDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String menuItemName;
    private String menuItemDescription;
    private Double menuItemPrice;
}
