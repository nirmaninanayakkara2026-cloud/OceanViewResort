package com.oceanview.resort.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "food_items")
public class FoodItem {
    
    @Id
    private String id;
    
    private String name;
    
    private String category; // breakfast, lunch, dinner, dessert, beverage
    
    private Double price;
    
    private String description;
    
    private String image;
    
    private boolean available = true;
}
