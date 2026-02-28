package com.oceanview.resort.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "food_orders")
public class FoodOrder {
    
    @Id
    private String id;
    
    private String userId;
    
    private String guestName;
    
    private String roomNumber;
    
    private List<OrderItem> items;
    
    private Double totalPrice;
    
    private String status; // pending, preparing, delivered, cancelled
    
    private String deliveryInstructions;
    
    private LocalDateTime orderedAt = LocalDateTime.now();
    
    private LocalDateTime deliveredAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String foodItemId;
        private String name;
        private Integer quantity;
        private Double price;
    }
}
