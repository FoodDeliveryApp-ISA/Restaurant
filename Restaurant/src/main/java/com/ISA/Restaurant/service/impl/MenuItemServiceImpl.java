package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuItemSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuItemDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.repo.MenuItemRepository;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.service.MenuItemService;
import com.ISA.Restaurant.service.MenuService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuRepository menuRepository;

    /**
     * Create a new menu item.
     *
     * @param menuItemDto the MenuItemDto containing menu item data.
     * @return the created MenuItemDto.
     */
    @Override
    public MenuItemDto createMenuItem(RequestMenuItemSaveDto menuItemDto, Long menuId) {
        // Fetch the Menu entity by menuId
        log.info("Create menu item with id: " + menuId);
        Menu menu = menuRepository.getMenuByMenuId(menuId);
        log.info(menu.toString());
        // Map the DTO to the MenuItem entity
        MenuItem menuItem = new MenuItem();
        menuItem.setMenuItemName(menuItemDto.getMenuItemName());
        menuItem.setMenuItemDescription(menuItemDto.getMenuItemDescription());
        menuItem.setMenuItemPrice(menuItemDto.getMenuItemPrice());
        menuItem.setMenu(menu); // Associate the menu
        log.info(menuItem.toString());
        // Save the menu item and map it back to the DTO
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        log.info(savedMenuItem.toString());
        return mapEntityToDto(savedMenuItem);
    }

    @Override
    public MenuItemDto getMenuItemById(Long menuId, Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuItemId, menuId);
        return mapEntityToDto(menuItem);
    }

    @Override
    public MenuItemDto updateMenuItem(Long menuId, Long menuItemId, RequestUpdatedMenuItemDto updatedMenuItemDto) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuItemId, menuId);

        menuItem.setMenuItemName(updatedMenuItemDto.getMenuItemName());
        menuItem.setMenuItemDescription(updatedMenuItemDto.getMenuItemDescription());
        menuItem.setMenuItemPrice(updatedMenuItemDto.getMenuItemPrice());
        menuItem.setCoverImageUrl(updatedMenuItemDto.getCoverImageUrl());

        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return mapEntityToDto(updatedMenuItem);
    }

    @Override
    public void deleteMenuItem(Long menuId, Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuItemId, menuId);
        menuItemRepository.delete(menuItem);
    }

    /**
     * Get all menu items for a specific menu.
     *
     * @param menuId the ID of the menu to fetch menu items for.
     * @return the list of MenuItemDto.
     */
    @Override
    public List<MenuItemDto> getAllMenuItemsForMenu(Long menuId) {
        log.info("Get all menu items for menu with id: " + menuId);
        // Fetch the Menu entity by menuId
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("Menu not found with id " + menuId));
        log.info(menu.toString());

        // Fetch all menu items for the given menu
        List<MenuItem> menuItems = menuItemRepository.findByMenu(menu);
        log.info(menuItems.toString());

        // Map the entities to DTOs using the custom mapping function
        List<MenuItemDto> menuItemDtos = menuItems
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
        log.info("menu Items : "+menuItemDtos.toString());

        return menuItemDtos;
    }

    /**
     * Custom mapping function to map MenuItem entity to MenuItemDto.
     *
     * @param menuItem the MenuItem entity to map.
     * @return the mapped MenuItemDto.
     */
    private MenuItemDto mapEntityToDto(MenuItem menuItem) {
        MenuItemDto menuItemDto = new MenuItemDto();
        menuItemDto.setMenuItemId(menuItem.getMenuItemId());
        menuItemDto.setMenuItemName(menuItem.getMenuItemName());
        menuItemDto.setMenuItemDescription(menuItem.getMenuItemDescription());
        menuItemDto.setMenuItemPrice(menuItem.getMenuItemPrice());
        menuItemDto.setActive(menuItem.getActive());
        menuItemDto.setCoverImageUrl(menuItem.getCoverImageUrl());

        // Handle null or invalid price
        Double price = menuItemDto.getMenuItemPrice();
        if (price == null || price < 0) {
            menuItemDto.setMenuItemPrice(0.0); // Set a default price if null or invalid
        }

        return menuItemDto;
    }


    /**
     * Custom method to map MenuItemDto to MenuItem entity.
     *
     * @param menuItemDto the MenuItemDto to map.
     * @return the mapped MenuItem entity.
     */
    private MenuItem mapDtoToEntity(MenuItemDto menuItemDto) {
        return new MenuItem(
                menuItemDto.getMenuItemId(),
                menuItemDto.getMenuItemName(),
                menuItemDto.getMenuItemDescription(),
                menuItemDto.getMenuItemPrice(),
                null, // This assumes menu mapping will be handled elsewhere.
                menuItemDto.getActive(),
                menuItemDto.getCoverImageUrl()
        );
    }
}

