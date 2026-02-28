package com.oceanview.resort.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contacts")
public class Contact {
    
    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    private String phone;
    
    private String subject;
    
    private String message;
    
    private String status; // new, read, replied
    
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    private LocalDateTime respondedAt;
}
