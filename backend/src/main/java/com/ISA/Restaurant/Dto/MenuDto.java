package com.ISA.Restaurant.Dto;

//import com.ISA.Restaurant.Dto.MenuItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDto implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long menuId;
    private String menuName;
    private String menuDescription;
    private Boolean active;
    private String coverImageUrl;
//    private List<MenuItemDto> items; // Nested DTO for menu items
}



