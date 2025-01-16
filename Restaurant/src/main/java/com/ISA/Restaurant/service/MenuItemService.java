package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuItemSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuItemDto;

import java.util.List;

public interface MenuItemService {

    /**
     * Create a new menu item.
     *
     * @param menuItemDto the MenuItemDto object containing menu item data.
     * @return the created MenuItemDto.
     */
    MenuItemDto createMenuItem(RequestMenuItemSaveDto menuItemDto, Long menuId);

    MenuItemDto getMenuItemById(Long menuId, Long menuItemId);

    MenuItemDto updateMenuItem(Long menuId, Long menuItemId, RequestUpdatedMenuItemDto updatedMenuItemDto);

    void deleteMenuItem(Long menuId, Long menuItemId);

    List<MenuItemDto> getAllMenuItemsForMenu(Long menuId);

    void evictMenuItemCache();
}
