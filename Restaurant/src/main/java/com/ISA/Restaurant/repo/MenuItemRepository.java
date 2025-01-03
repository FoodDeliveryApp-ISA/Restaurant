package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    MenuItem findByMenuItemIdAndMenu_MenuId(Long menuItemId, Long menuId);
    List<MenuItem> findByMenu(Menu menu);
    List<MenuItem> findByMenu_MenuId(Long menuMenuId);

}

