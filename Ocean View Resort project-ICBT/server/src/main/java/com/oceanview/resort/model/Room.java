package com.oceanview.resort.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {
    
    @Id
    private String id;
    
    private String name;
    
    private String type; // Standard, Deluxe, Suite, Presidential
    
    private String description;
    
    private Double pricePerNight;
    
    private Integer capacity;
    
    private List<String> amenities;
    
    private String imageUrl;
    
    private Integer totalRooms;
    
    private Integer availableRooms;
    
    private boolean active = true;
}
