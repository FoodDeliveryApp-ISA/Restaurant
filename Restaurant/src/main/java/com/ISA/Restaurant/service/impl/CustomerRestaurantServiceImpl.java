package com.ISA.Restaurant.service.impl;

//import com.ISA.Restaurant.Entity.Menu;
//import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.MenuItem;
import com.ISA.Restaurant.exception.RestaurantNotFoundException;
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
        try {
            log.info("Fetching details for restaurant ID: {}", request.getRestaurantId());
            log.info("*******************************************************************************");

            // Fetch restaurant
            var restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .filter(com.ISA.Restaurant.Entity.Restaurant::getActive)
                    .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found or inactive"));

            // Fetch menus and menu items
            List<Restaurant.Menu> menus = menuRepository.findByRestaurant_RestaurantId(restaurant.getRestaurantId())
                    .stream()
                    .filter(Menu::getActive)
                    .map(this::mapMenuToGrpc)
                    .collect(Collectors.toList());

            log.info("Found {} menu(s)", menus.size());
            log.info("Menus: {}", menus);
            // Build response
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

            responseObserver.onNext(response);
            log.info("Successfully fetched details for restaurant ID: {}", request.getRestaurantId());
        } catch (RestaurantNotFoundException e) {
            log.error("Error fetching restaurant details: {}", e.getMessage());
            responseObserver.onError(e);
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            responseObserver.onError(new RuntimeException("Internal server error"));
        } finally {
            responseObserver.onCompleted();
        }
    }

    private Restaurant.Menu mapMenuToGrpc(Menu menu) {
        List<Restaurant.MenuItem> menuItems = menuItemRepository.findByMenu_MenuId(menu.getMenuId())
                .stream()
                .filter(MenuItem::getActive)
                .map(this::mapMenuItemToGrpc)
                .collect(Collectors.toList());
                log.info("Processing grpc menu items: {}", menuItems);
        return Restaurant.Menu.newBuilder()
                .setMenuId(menu.getMenuId())
                .setMenuName(menu.getMenuName())
                .setMenuDescription(menu.getMenuDescription())
                .addAllMenuItems(menuItems)
                .build();
    }

    private Restaurant.MenuItem mapMenuItemToGrpc(MenuItem menuItem) {
        log.info("Menu items urls : {}",menuItem.getImageUrls().toString());
        return Restaurant.MenuItem.newBuilder()
                .setMenuItemId(menuItem.getMenuItemId())
                .setMenuItemName(menuItem.getMenuItemName())
                .setMenuItemDescription(menuItem.getMenuItemDescription())
                .setMenuItemPrice(menuItem.getMenuItemPrice())
                .addAllImageUrls(menuItem.getImageUrls() != null ? menuItem.getImageUrls() : List.of())
                .build();
    }

}
