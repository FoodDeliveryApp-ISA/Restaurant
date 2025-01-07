package com.ISA.Restaurant.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuItemId;

    private String menuItemName;

    private String menuItemDescription;

    private Double menuItemPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    private Boolean active;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "menu_item_images", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;


    @Override
    public String toString() {
        return "MenuItem{" +
                "menuItemId=" + menuItemId +
                ", menuItemName='" + menuItemName + '\'' +
                ", menuItemDescription='" + menuItemDescription + '\'' +
                ", menuItemPrice=" + menuItemPrice +
                ", active=" + active +
                '}';
    }
}
