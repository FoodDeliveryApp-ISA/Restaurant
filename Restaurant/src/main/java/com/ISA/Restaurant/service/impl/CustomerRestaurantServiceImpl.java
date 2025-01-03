package com.ISA.Restaurant.service.impl;

import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import restaurant.*;

@GrpcService
public class CustomerRestaurantServiceImpl extends RestaurantServiceGrpc.RestaurantServiceImplBase {


    @Override
    public void getAllRestaurants(Empty request, StreamObserver<Restaurant.RestaurantList> responseObserver) {
        // Fetch all restaurant data from database (dummy data for now)
        Restaurant.RestaurantDto restaurant1 = Restaurant.RestaurantDto.newBuilder()
                .setRestaurantId(1)
                .setRestaurantName("Restaurant A")
                .setRestaurantEmail("contact@resta.com")
                .setRestaurantAddress("123 A St")
                .setRestaurantPhone("123-456-7890")
                .setRestaurantCity("City A")
                .setRestaurantLocation("Loc A")
                .setCoverImageUrl("http://example.com/cover1.jpg")
                .build();

        Restaurant.RestaurantDto restaurant2 = Restaurant.RestaurantDto.newBuilder()
                .setRestaurantId(2)
                .setRestaurantName("Restaurant B")
                .setRestaurantEmail("contact@restb.com")
                .setRestaurantAddress("456 B St")
                .setRestaurantPhone("987-654-3210")
                .setRestaurantCity("City B")
                .setRestaurantLocation("Loc B")
                .setCoverImageUrl("http://example.com/cover2.jpg")
                .build();

        Restaurant.RestaurantList restaurantList = Restaurant.RestaurantList.newBuilder()
                .addRestaurants(restaurant1)
                .addRestaurants(restaurant2)
                .build();

        responseObserver.onNext(restaurantList);
        responseObserver.onCompleted();
    }

    @Override
    public void getRestaurantById(Restaurant.RestaurantIdRequest request, StreamObserver<Restaurant.RestaurantDto> responseObserver) {
        // Fetch restaurant by ID from database (dummy data for now)
        int restaurantId = request.getRestaurantId();
        Restaurant.RestaurantDto restaurant = Restaurant.RestaurantDto.newBuilder()
                .setRestaurantId(restaurantId)
                .setRestaurantName("Restaurant " + restaurantId)
                .setRestaurantEmail("contact@rest" + restaurantId + ".com")
                .setRestaurantAddress("Address " + restaurantId)
                .setRestaurantPhone("123-456-789" + restaurantId)
                .setRestaurantCity("City " + restaurantId)
                .setRestaurantLocation("Loc " + restaurantId)
                .setCoverImageUrl("http://example.com/cover" + restaurantId + ".jpg")
                .build();

        responseObserver.onNext(restaurant);
        responseObserver.onCompleted();
    }
}
