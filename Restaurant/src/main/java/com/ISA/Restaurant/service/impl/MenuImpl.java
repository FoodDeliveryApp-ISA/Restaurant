package com.ISA.Restaurant.service.impl;


import com.ISA.Restaurant.Dto.MenuDto;
//import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuDto;
import com.ISA.Restaurant.Entity.Menu;
//import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.service.MenuService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class MenuImpl implements MenuService {

    private final MenuRepository menuRepository;

    private Menu mapDtoToEntity(Object dto) {
        Menu menu = new Menu();

        if (dto instanceof RequestMenuSaveDto saveDto) {
            menu.setMenuName(saveDto.getMenuName());
            menu.setMenuDescription(saveDto.getMenuDescription());
            menu.setActive(saveDto.getActive());
            menu.setCoverImageUrl(saveDto.getCoverImageUrl());
        } else if (dto instanceof RequestUpdatedMenuDto updateDto) {
            menu.setMenuName(updateDto.getMenuName());
            menu.setMenuDescription(updateDto.getMenuDescription());
            menu.setActive(updateDto.getActive());
            menu.setCoverImageUrl(updateDto.getCoverImageUrl());
        }

        return menu;
    }

//    private Menu mapDtoToEntity(RequestMenuSaveDto dto) {
//        Menu menu = new Menu();
//        menu.setMenuName(dto.getMenuName());
//        menu.setMenuDescription(dto.getMenuDescription());
//        menu.setActive(dto.getActive());
//        menu.setCoverImageUrl(dto.getCoverImageUrl());
//
////        if (dto.getItems() != null) {
////            List<MenuItem> items = dto.getItems().stream()
////                    .map(itemDto -> {
////                        MenuItem menuItem = new MenuItem();
////                        menuItem.setMenuItemId(itemDto.getMenuItemId());
////                        menuItem.setMenuItemName(itemDto.getMenuItemName());
////                        menuItem.setMenuItemDescription(itemDto.getMenuItemDescription());
////                        menuItem.setMenuItemPrice(itemDto.getMenuItemPrice());
////                        menuItem.setActive(itemDto.getActive());
////                        menuItem.setMenu(menu); // Set the parent menu
////                        return menuItem;
////                    })
////                    .collect(Collectors.toList());
////            menu.setItems(items);
////        }
//
//        return menu;
//    }


    private MenuDto mapEntityToDto(Menu entity) {
        MenuDto menuDto = new MenuDto();
        menuDto.setMenuId(entity.getMenuId());
        menuDto.setMenuName(entity.getMenuName());
        menuDto.setMenuDescription(entity.getMenuDescription());
        menuDto.setActive(entity.getActive());
        menuDto.setCoverImageUrl(entity.getCoverImageUrl());

//        if (entity.getItems() != null) {
//            List<MenuItemDto> items = entity.getItems().stream()
//                    .map(item -> new MenuItemDto(
//                            item.getMenuItemId(),
//                            item.getMenuItemName(),
//                            item.getMenuItemDescription(),
//                            item.getMenuItemPrice(),
//                            item.getActive()
//                    ))
//                    .collect(Collectors.toList());
//            menuDto.setItems(items);
//        }

        return menuDto;
    }


    @Override
    public MenuDto saveMenu(RequestMenuSaveDto menuDto, Restaurant restaurant) {
        Menu menu = mapDtoToEntity(menuDto);
        menu.setRestaurant(restaurant);
        log.info("Menu saved");
        log.info("Restaurant {}", restaurant);
        log.info("Menu {}", menu);
        Menu savedMenu = menuRepository.save(menu);
        log.info("Saved menu {}", savedMenu);
        return mapEntityToDto(savedMenu);
    }

    @Override
    public MenuDto getMenuById(long menuId) {
        return menuRepository.findById(menuId)
                .map(this::mapEntityToDto)
                .orElse(null); // Return null if not found
    }

    @Override
    public List<MenuDto> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuDto> getMenusByRestaurant(Restaurant authenticatedRestaurant) {
        if (authenticatedRestaurant == null) {
            throw new IllegalArgumentException("Authenticated restaurant cannot be null.");
        }

        // Fetch menus associated with the authenticated restaurant
        List<Menu> menus = menuRepository.findByRestaurant(authenticatedRestaurant);

        // Convert the list of Menu entities to MenuDto objects
        return menus.stream()
                .map(menu -> new MenuDto(
                        menu.getMenuId(),
                        menu.getMenuName(),
                        menu.getMenuDescription(),
                        menu.getActive(),
                        menu.getCoverImageUrl()
                ))
                .toList(); // Collect to a list
    }


    @Override
    public MenuDto updateMenu(long menuId, RequestUpdatedMenuDto menuDto) {
        log.info("Menu updated");

        // Check if the menu exists
        if (menuRepository.existsById(menuId)) {
            log.info("Menu updated2");

            // Retrieve the existing menu to get the associated restaurant
            Menu existingMenu = menuRepository.findById(menuId)
                    .orElseThrow(() -> new IllegalArgumentException("Menu not found"));

            // Map DTO to the menu and retain the restaurant
            Menu menu = new Menu();
            menu.setMenuId(menuId); // Retain menu ID
            menu.setMenuName(menuDto.getMenuName());
            menu.setMenuDescription(menuDto.getMenuDescription());
            menu.setActive(menuDto.getActive());
            menu.setCoverImageUrl(menuDto.getCoverImageUrl());
            menu.setRestaurant(existingMenu.getRestaurant()); // Retain the restaurant

            log.info("Menu before saving: {}", menu);

            // Save the updated menu
            Menu updatedMenu = menuRepository.save(menu);
            log.info("Updated menu: {}", updatedMenu);

            return mapEntityToDto(updatedMenu);
        }

        // Return null if menu does not exist
        return null;
    }


    @Override
    public boolean deleteMenu(long menuId) {
        if (menuRepository.existsById(menuId)) {
            menuRepository.deleteById(menuId);
            return true;
        }
        return false; // Return false if menu does not exist
    }
}
