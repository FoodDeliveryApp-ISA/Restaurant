//package com.ISA.Restaurant.Entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import static org.springframework.data.jpa.domain.AbstractPersistable_.id;
//@Data
//@Entity
//@NoArgsConstructor
//@AllArgsConstructor
//public class MenuItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long menuItemId;
//
//    private String menuItemName;
//
//    private String menuItemDescription;
//
//    private Double menuItemPrice;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "menu_id", nullable = false)
//    private Menu menu;
//
//    @Column(name = "active")
//    private Boolean active;
//
//    @Column(name = "cover_image_url")
//    private String coverImageUrl;
//
//    @Override
//    public String toString() {
//        return "MenuItem{" +
//                "id=" + menuItemId +
//                ", name='" + menuItemName + '\'' +
//                ", description='" + menuItemDescription + '\'' +
//                ", price=" + menuItemPrice +
//                '}';
//    }
//}
