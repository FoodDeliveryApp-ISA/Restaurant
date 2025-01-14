package com.ISA.Restaurant.service.impl;

import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuItemSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuItemDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.exception.InvalidMenuItemException;
import com.ISA.Restaurant.exception.MenuItemNotFoundException;
import com.ISA.Restaurant.repo.MenuItemRepository;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.service.MenuItemService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MenuItemServiceImpl implements MenuItemService {

    private static final String MENU_ITEM_CACHE = "menuItems";

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public MenuItemDto createMenuItem(RequestMenuItemSaveDto menuItemDto, Long menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu not found with id " + menuId));

        if (menuItemDto.getMenuItemPrice() == null || menuItemDto.getMenuItemPrice() < 0) {
            throw new InvalidMenuItemException("Invalid menu item price. It must be a positive value.");
        }

        MenuItem menuItem = new MenuItem();
        menuItem.setMenuItemName(menuItemDto.getMenuItemName());
        menuItem.setMenuItemDescription(menuItemDto.getMenuItemDescription());
        menuItem.setMenuItemPrice(menuItemDto.getMenuItemPrice());
        menuItem.setMenu(menu);
        menuItem.setActive(false);

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return mapEntityToDto(savedMenuItem);
    }

    @Override
    @Cacheable(value = MENU_ITEM_CACHE, key = "#menuItemId")
    public MenuItemDto getMenuItemById(Long menuId, Long menuItemId) {
        log.info(menuItemId.toString(),menuId);
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuId,menuItemId);
        if (menuItem == null) {
            throw new MenuItemNotFoundException("Menu item not found with id " + menuItemId + " in menu " + menuId);
        }
        log.info("Menu item found with id " + menuItemId + " in menu " + menuId);
        return mapEntityToDto(menuItem);
    }

    @Override
    @CachePut(value = MENU_ITEM_CACHE, key = "#menuItemId")
    public MenuItemDto updateMenuItem(Long menuId, Long menuItemId, RequestUpdatedMenuItemDto updatedMenuItemDto) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuItemId, menuId);
        if (menuItem == null) {
            throw new MenuItemNotFoundException("Menu item not found with id " + menuItemId + " in menu " + menuId);
        }

        if (updatedMenuItemDto.getMenuItemPrice() == null || updatedMenuItemDto.getMenuItemPrice() < 0) {
            throw new InvalidMenuItemException("Invalid menu item price. It must be a positive value.");
        }

        menuItem.setMenuItemName(updatedMenuItemDto.getMenuItemName());
        menuItem.setMenuItemDescription(updatedMenuItemDto.getMenuItemDescription());
        menuItem.setMenuItemPrice(updatedMenuItemDto.getMenuItemPrice());
        menuItem.setActive(updatedMenuItemDto.getActive());
        menuItem.setImageUrls(updatedMenuItemDto.getImageUrls()); // Update multiple image URLs
        log.info(menuItem.toString());
        log.info(updatedMenuItemDto.toString());
//        log.info(updatedMenuItemDto.getImageUrls().toString());
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        log.info(updatedMenuItem.toString());
//        log.info(updatedMenuItem.getImageUrls().toString());
        return mapEntityToDto(updatedMenuItem);
    }

    @Override
    @CacheEvict(value = MENU_ITEM_CACHE, key = "#menuItemId")
    public void deleteMenuItem(Long menuId, Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndMenu_MenuId(menuItemId, menuId);
        if (menuItem == null) {
            throw new MenuItemNotFoundException("Menu item not found with id " + menuItemId + " in menu " + menuId);
        }
        menuItemRepository.delete(menuItem);
    }

    @Override
    @Cacheable(value = MENU_ITEM_CACHE, key = "'menu_' + #menuId")
    public List<MenuItemDto> getAllMenuItemsForMenu(Long menuId) {
        log.info("Get all menu items for menu with id: " + menuId);
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu not found with id " + menuId));
        log.info(menu.toString());

        List<MenuItem> menuItems = menuItemRepository.findByMenu(menu);
        log.info(menuItems.toString());

        List<MenuItemDto> menuItemDtos = menuItems
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
        log.info("menu Items : " + menuItemDtos.toString());

        return menuItemDtos;
    }

    private MenuItemDto mapEntityToDto(MenuItem menuItem) {
        MenuItemDto menuItemDto = new MenuItemDto();
        menuItemDto.setMenuItemId(menuItem.getMenuItemId());
        menuItemDto.setMenuItemName(menuItem.getMenuItemName());
        menuItemDto.setMenuItemDescription(menuItem.getMenuItemDescription());
        menuItemDto.setMenuItemPrice(menuItem.getMenuItemPrice());
        menuItemDto.setActive(menuItem.getActive());
        menuItemDto.setImageUrls(menuItem.getImageUrls()); // Map multiple image URLs

//        log.info(menuItemDto.getImageUrls().toString());

        Double price = menuItemDto.getMenuItemPrice();
        if (price == null || price < 0) {
            menuItemDto.setMenuItemPrice(0.0);
        }

        return menuItemDto;
    }
}


