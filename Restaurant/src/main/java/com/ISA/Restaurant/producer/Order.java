package com.ISA.Restaurant.producer;

import java.util.List;

public class Order {
    private String orderId;
    private List<Double> restaurantLocation;
    private List<Double> customerLocation;
    private String customerName;
    private String customerAddress;
    private String customerPhone;

    // Default Constructor
    public Order() {
    }

    // Parameterized Constructor
    public Order(String orderId, List<Double> restaurantLocation, List<Double> customerLocation, String customerName, String customerAddress, String customerPhone) {
        this.orderId = orderId;
        this.restaurantLocation = restaurantLocation;
        this.customerLocation = customerLocation;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.customerPhone = customerPhone;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public List<Double> getRestaurantLocation() {
        return restaurantLocation;
    }

    public void setRestaurantLocation(List<Double> restaurantLocation) {
        this.restaurantLocation = restaurantLocation;
    }

    public List<Double> getCustomerLocation() {
        return customerLocation;
    }

    public void setCustomerLocation(List<Double> customerLocation) {
        this.customerLocation = customerLocation;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", restaurantLocation=" + restaurantLocation +
                ", customerLocation=" + customerLocation +
                ", customerName='" + customerName + '\'' +
                ", customerAddress='" + customerAddress + '\'' +
                ", customerPhone='" + customerPhone + '\'' +
                '}';
    }
}
