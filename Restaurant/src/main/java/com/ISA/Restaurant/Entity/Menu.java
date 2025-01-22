package com.ISA.Restaurant.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Menu implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuId;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    private String menuDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false) // Maps the column in Menu table
    private Restaurant restaurant;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuItem> items;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "active")
    private Boolean active;


    @Override
    public String toString() {
        return "Menu{" +
                "id=" + menuId +
                ", name='" + menuName + '\'' +
                '}';
    }
}
