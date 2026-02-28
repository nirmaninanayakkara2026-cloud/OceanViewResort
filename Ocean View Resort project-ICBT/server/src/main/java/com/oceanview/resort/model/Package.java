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
@Document(collection = "packages")
public class Package {
    
    @Id
    private String id;
    
    private String packageId; // honeymoon, anniversary, birthday, family, wellness, adventure
    
    private String name;
    
    private Double price;
    
    private String icon;
    
    private List<String> features;
    
    private String description;
    
    private boolean popular = false;
    
    private boolean active = true;
}
