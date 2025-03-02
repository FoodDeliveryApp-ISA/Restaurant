package com.ISA.Restaurant.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdatedMenuDto {
    private String menuName;
    private String menuDescription;
    private Boolean active;
    private String coverImageUrl;
}
