package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.MenuDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @PostMapping
    public ResponseEntity<MenuDto> createMenu(@RequestBody MenuDto menu) {
        return ResponseEntity.ok(menuService.saveMenu(menu));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @GetMapping
    public ResponseEntity<List<MenuDto>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }
}
