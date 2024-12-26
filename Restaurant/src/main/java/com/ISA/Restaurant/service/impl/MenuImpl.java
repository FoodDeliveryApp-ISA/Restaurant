package com.ISA.Restaurant.service.impl;


import com.ISA.Restaurant.Dto.MenuDto;
import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.service.MenuService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MenuImpl implements MenuService {

    private final MenuRepository menuRepository;

    private Menu mapDtoToEntity(MenuDto dto) {
        Menu menu = new Menu();
        menu.setMenuId(dto.getMenuId());
        menu.setMenuName(dto.getMenuName());
        menu.setMenuDescription(dto.getMenuDescription());
        menu.setActive(dto.getActive());
        menu.setCoverImageUrl(dto.getCoverImageUrl());

        if (dto.getItems() != null) {
            List<MenuItem> items = dto.getItems().stream()
                    .map(itemDto -> {
                        MenuItem menuItem = new MenuItem();
                        menuItem.setMenuItemId(itemDto.getMenuItemId());
                        menuItem.setMenuItemName(itemDto.getMenuItemName());
                        menuItem.setMenuItemDescription(itemDto.getMenuItemDescription());
                        menuItem.setMenuItemPrice(itemDto.getMenuItemPrice());
                        menuItem.setActive(itemDto.getActive());
                        menuItem.setMenu(menu); // Set the parent menu
                        return menuItem;
                    })
                    .collect(Collectors.toList());
            menu.setItems(items);
        }

        return menu;
    }


    private MenuDto mapEntityToDto(Menu entity) {
        MenuDto menuDto = new MenuDto();
        menuDto.setMenuId(entity.getMenuId());
        menuDto.setMenuName(entity.getMenuName());
        menuDto.setMenuDescription(entity.getMenuDescription());
        menuDto.setActive(entity.getActive());
        menuDto.setCoverImageUrl(entity.getCoverImageUrl());

        if (entity.getItems() != null) {
            List<MenuItemDto> items = entity.getItems().stream()
                    .map(item -> new MenuItemDto(
                            item.getMenuItemId(),
                            item.getMenuItemName(),
                            item.getMenuItemDescription(),
                            item.getMenuItemPrice(),
                            item.getActive()
                    ))
                    .collect(Collectors.toList());
            menuDto.setItems(items);
        }

        return menuDto;
    }


    @Override
    public MenuDto saveMenu(MenuDto menuDto) {
        Menu menu = mapDtoToEntity(menuDto);
        Menu savedMenu = menuRepository.save(menu);
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
    public MenuDto updateMenu(long menuId, MenuDto menuDto) {
        if (menuRepository.existsById(menuId)) {
            Menu menu = mapDtoToEntity(menuDto);
            menu.setMenuId(menuId); // Ensure ID is retained
            Menu updatedMenu = menuRepository.save(menu);
            return mapEntityToDto(updatedMenu);
        }
        return null; // Return null if not found
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
