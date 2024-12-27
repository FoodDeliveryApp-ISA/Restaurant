//package com.ISA.Restaurant.service;
//
//import com.ISA.Restaurant.Dto.MenuItemDto;
//import java.util.List;
//
//public interface MenuItemService {
//
//    /**
//     * Create a new menu item.
//     *
//     * @param menuItemDto the MenuItemDto object containing menu item data.
//     * @return the created MenuItemDto.
//     */
//    MenuItemDto createMenuItem(MenuItemDto menuItemDto);
//
//    /**
//     * Get a menu item by its ID.
//     *
//     * @param id the ID of the menu item.
//     * @return the MenuItemDto for the given ID, or null if not found.
//     */
//    MenuItemDto getMenuItemById(Long id);
//
//    /**
//     * Get all menu items.
//     *
//     * @return a list of all MenuItemDto objects.
//     */
//    List<MenuItemDto> getAllMenuItems();
//
//    /**
//     * Update an existing menu item by its ID.
//     *
//     * @param id the ID of the menu item to update.
//     * @param menuItemDto the MenuItemDto object containing updated data.
//     * @return the updated MenuItemDto, or null if the menu item does not exist.
//     */
//    MenuItemDto updateMenuItem(Long id, MenuItemDto menuItemDto);
//
//    /**
//     * Delete a menu item by its ID.
//     *
//     * @param id the ID of the menu item to delete.
//     * @return true if the menu item was successfully deleted, false otherwise.
//     */
//    boolean deleteMenuItem(Long id);
//}
