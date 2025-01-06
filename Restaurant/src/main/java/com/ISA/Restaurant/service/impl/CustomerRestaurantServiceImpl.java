package com.ISA.Restaurant.service.impl;

//import com.ISA.Restaurant.Entity.Menu;
//import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.repo.MenuItemRepository;
import com.ISA.Restaurant.repo.MenuRepository;
import com.ISA.Restaurant.repo.RestaurantRepository;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import restaurant.Restaurant;
import restaurant.RestaurantServiceGrpc;


import java.util.List;
import java.util.stream.Collectors;

@GrpcService
@Slf4j
public class CustomerRestaurantServiceImpl extends RestaurantServiceGrpc.RestaurantServiceImplBase {
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public void getAllRestaurantSummaries(Restaurant.Empty request, StreamObserver<Restaurant.RestaurantSummaryList> responseObserver) {
        log.info("Fetching all active restaurant summaries");

        // Filter and map active restaurants
        List<Restaurant.RestaurantSummary> summaries = restaurantRepository.findAll()
                .stream()
                .filter(restaurant -> restaurant != null && restaurant.getActive()) // Include only active restaurants
                .map(restaurant -> {
                    log.info("Processing restaurant: {} (ID: {})", restaurant.getRestaurantName(), restaurant.getRestaurantId());

                    return Restaurant.RestaurantSummary.newBuilder()
                            .setRestaurantId(restaurant.getRestaurantId())
                            .setRestaurantName(restaurant.getRestaurantName())
                            .setRestaurantCity(restaurant.getRestaurantCity())
                            .setCoverImageUrl(restaurant.getCoverImageUrl() != null ? restaurant.getCoverImageUrl() : "")
                            .build();
                })
                .collect(Collectors.toList());

        // Build the response
        Restaurant.RestaurantSummaryList response = Restaurant.RestaurantSummaryList.newBuilder()
                .addAllSummaries(summaries)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
        log.info("Finished processing all restaurant summaries");
    }

    @Override
    public void getRestaurantDetails(Restaurant.RestaurantIdRequest request, StreamObserver<Restaurant.RestaurantDetails> responseObserver) {
        log.info("Fetching details for restaurant ID: {}", request.getRestaurantId());

        com.ISA.Restaurant.Entity.Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .filter(com.ISA.Restaurant.Entity.Restaurant::getActive)// Ensure the restaurant is active
                .orElse(null);
        log.info("Processing restaurant details: {}", restaurant);
        if (restaurant == null) {
            responseObserver.onError(new RuntimeException("Restaurant not found or inactive"));
            return;
        }
        log.info("Processing restaurant details: {}", restaurant);
        // Fetch menus and active menu items
        List<Restaurant.Menu> menus = menuRepository.findByRestaurant_RestaurantId(restaurant.getRestaurantId())
                .stream()
                .filter(Menu::getActive) // Include only active menus
                .map(menu -> {
                    List<Restaurant.MenuItem> menuItems = menuItemRepository.findByMenu_MenuId(menu.getMenuId())
                            .stream()
                            .filter(MenuItem::getActive) // Include only active menu items
                            .map(menuItem -> Restaurant.MenuItem.newBuilder()
                                    .setMenuItemId(menuItem.getMenuItemId())
                                    .setMenuItemName(menuItem.getMenuItemName())
                                    .setMenuItemDescription(menuItem.getMenuItemDescription())
                                    .setMenuItemPrice(menuItem.getMenuItemPrice())
                                    .addAllImageUrls(menuItem.getImageUrls() != null ? menuItem.getImageUrls() : List.of())
                                    .build())
                            .collect(Collectors.toList());

                    return Restaurant.Menu.newBuilder()
                            .setMenuId(menu.getMenuId())
                            .setMenuName(menu.getMenuName())
                            .setMenuDescription(menu.getMenuDescription())
                            .addAllMenuItems(menuItems)
                            .build();
                })
                .collect(Collectors.toList());

        log.info("Processing restaurant details: {}", restaurant);

        // Build the restaurant details response
        Restaurant.RestaurantDetails response = Restaurant.RestaurantDetails.newBuilder()
                .setRestaurantId(restaurant.getRestaurantId())
                .setRestaurantName(restaurant.getRestaurantName())
                .setRestaurantAddress(restaurant.getRestaurantAddress())
                .setRestaurantPhone(restaurant.getRestaurantPhone())
                .setRestaurantCity(restaurant.getRestaurantCity())
                .setRestaurantLocation(restaurant.getRestaurantLocation())
                .setCoverImageUrl(restaurant.getCoverImageUrl() != null ? restaurant.getCoverImageUrl() : "")
                .addAllMenus(menus)
                .build();

        log.info("Processing restaurant details: {}", response);

        responseObserver.onNext(response);
        log.info("Finished processing restaurant details");
        responseObserver.onCompleted();
        log.info("Finished processing restaurant details for ID: {}", request.getRestaurantId());
    }
}
