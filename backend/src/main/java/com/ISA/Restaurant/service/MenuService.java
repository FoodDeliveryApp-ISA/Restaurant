package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.MenuDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.Restaurant;

import java.util.List;

public interface MenuService {

    /**
     * Save a menu.
     *
     * @param menuDto the MenuDto object to be saved.
     * @return the saved MenuDto.
     */
    MenuDto saveMenu(RequestMenuSaveDto menuDto , Restaurant restaurant);

    /**
     * Get a menu by ID.
     *
     * @param menuId the ID of the menu.
     * @return the MenuDto for the given ID, or null if not found.
     */
    MenuDto getMenuById(long menuId);

    /**
     * Get all menus.
     *
     * @return a list of all MenuDto objects.
     */
    List<MenuDto> getAllMenus() ;

    /**
     * Update an existing menu by ID.
     *
     * @param menuId the ID of the menu to be updated.
     * @param menuDto the MenuDto object containing updated data.
     * @return the updated MenuDto, or null if the menu does not exist.
     */
    MenuDto updateMenu(long menuId, RequestUpdatedMenuDto menuDto) ;

    /**
     * Delete a menu by ID.
     *
     * @param menuId the ID of the menu to be deleted.
     * @return true if the menu was successfully deleted, false otherwise.
     */
    boolean deleteMenu(long menuId) ;

    List<MenuDto> getMenusByRestaurant(Restaurant authenticatedRestaurant);

    void evictMenuCache();
}
