package com.ISA.Restaurant.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdatedMenuItemDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long menuItemId;
    private String menuItemName;
    private String menuItemDescription;
    private Double menuItemPrice;
    private Boolean active;
    private List<String> imageUrls;
}
