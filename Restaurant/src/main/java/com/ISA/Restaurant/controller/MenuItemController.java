package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.MenuItemDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.service.MenuItemService;
import com.ISA.Restaurant.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menuitems")
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<MenuItemDto> createMenu(@RequestBody MenuItemDto menuItemDto) {
        return ResponseEntity.ok(menuItemService.createMenuItem(menuItemDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenus() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }
}