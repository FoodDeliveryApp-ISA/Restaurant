//package com.ISA.Restaurant.service.impl;
//
//import com.ISA.Restaurant.Dto.MenuItemDto;
//import com.ISA.Restaurant.Entity.MenuItem;
//import com.ISA.Restaurant.repo.MenuItemRepository;
//import com.ISA.Restaurant.service.MenuItemService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class MenuItemServiceImpl implements MenuItemService {
//
//    @Autowired
//    private MenuItemRepository menuItemRepository;
//
//    /**
//     * Create a new menu item.
//     *
//     * @param menuItemDto the MenuItemDto containing menu item data.
//     * @return the created MenuItemDto.
//     */
//    @Override
//    public MenuItemDto createMenuItem(MenuItemDto menuItemDto) {
//        MenuItem menuItem = mapDtoToEntity(menuItemDto);
//        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
//        return mapEntityToDto(savedMenuItem);
//    }
//
//    /**
//     * Get a menu item by its ID.
//     *
//     * @param id the ID of the menu item.
//     * @return the MenuItemDto for the given ID.
//     */
//    @Override
//    public MenuItemDto getMenuItemById(Long id) {
//        MenuItem menuItem = menuItemRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("MenuItem not found"));
//        return mapEntityToDto(menuItem);
//    }
//
//    /**
//     * Get all menu items.
//     *
//     * @return a list of all MenuItemDto objects.
//     */
//    @Override
//    public List<MenuItemDto> getAllMenuItems() {
//        List<MenuItem> menuItems = menuItemRepository.findAll();
//        return menuItems.stream()
//                .map(this::mapEntityToDto)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Map MenuItemDto to MenuItem entity.
//     *
//     * @param menuItemDto the MenuItemDto to map.
//     * @return the mapped MenuItem entity.
//     */
//    private MenuItem mapDtoToEntity(MenuItemDto menuItemDto) {
//        return new MenuItem(
//                menuItemDto.getMenuItemId(),
//                menuItemDto.getMenuItemName(),
//                menuItemDto.getMenuItemDescription(),
//                menuItemDto.getMenuItemPrice(),
//                null, // This assumes menu mapping will be handled elsewhere.
//                menuItemDto.getActive(),
//                menuItemDto.getCoverImageUrl()
//        );
//    }
//
//    /**
//     * Map MenuItem entity to MenuItemDto.
//     *
//     * @param menuItem the MenuItem entity to map.
//     * @return the mapped MenuItemDto.
//     */
//    private MenuItemDto mapEntityToDto(MenuItem menuItem) {
//        return new MenuItemDto(
//                menuItem.getMenuItemId(),
//                menuItem.getMenuItemName(),
//                menuItem.getMenuItemDescription(),
//                menuItem.getMenuItemPrice(),
//                menuItem.getActive(),
//                menuItem.getCoverImageUrl()
//        );
//    }
//}
