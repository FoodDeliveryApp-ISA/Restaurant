package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuItemSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuItemDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.service.MenuItemService;
import com.ISA.Restaurant.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/menu/{menuId}/menuitems")
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<MenuItemDto> createMenu(
            @PathVariable Long menuId,
            @RequestBody RequestMenuItemSaveDto menuItemDto) {
        log.info("createMenu: {}", menuId);
        return ResponseEntity.ok(menuItemService.createMenuItem(menuItemDto, menuId));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<MenuItemDto> getMenuById(@PathVariable Long id) {
//        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
//    }
    // Get a menu item by ID
    @GetMapping("/{menuItemId}")
    public ResponseEntity<MenuItemDto> getMenuItemById(
            @PathVariable Long menuId,
            @PathVariable Long menuItemId) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(menuId, menuItemId));
    }

    // Update a menu item
    @PutMapping("/{menuItemId}")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long menuId,
            @PathVariable Long menuItemId,
            @RequestBody RequestUpdatedMenuItemDto updatedMenuItemDto) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(menuId, menuItemId, updatedMenuItemDto));
    }

    // Delete a menu item
    @DeleteMapping("/{menuItemId}")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Long menuId,
            @PathVariable Long menuItemId) {
        menuItemService.deleteMenuItem(menuId, menuItemId);
        return ResponseEntity.noContent().build();
    }

    // Get all menu items for a specific menu
    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItemsForMenu(@PathVariable Long menuId) {
        log.info("getAllMenuItemsForMenu: {}", menuId);
        List<MenuItemDto> menuItems = menuItemService.getAllMenuItemsForMenu(menuId);
        log.info("getAllMenuItemsForMenu: {}", menuItems);
        return ResponseEntity.ok(menuItems);
    }

}