package com.ISA.Restaurant.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemDTO {
    private String menuItemId;
    private int quantity;

}
