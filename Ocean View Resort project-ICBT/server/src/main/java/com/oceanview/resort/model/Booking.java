package com.oceanview.resort.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    private String userId;
    
    private String guestName;
    
    private String guestEmail;
    
    private String guestPhone;
    
    private String guestAddress;
    
    private String roomType;
    
    private LocalDate checkIn;
    
    private LocalDate checkOut;
    
    private Integer numberOfGuests;
    
    private Integer numberOfNights;
    
    private String selectedPackage; // honeymoon, anniversary, birthday, etc.
    
    private List<String> foodPreferences; // breakfast, lunch, dinner
    
    private String drinkPackage; // none, basic, premium
    
    private String specialRequests;
    
    private Double roomPrice;
    
    private Double packagePrice;
    
    private Double totalPrice;
    
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    
    private String reservationNumber;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
}
