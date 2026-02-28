package com.oceanview.resort.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    @NotBlank(message = "Guest name is required")
    private String guestName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String guestEmail;
    
    @NotBlank(message = "Phone is required")
    private String guestPhone;
    
    @NotBlank(message = "Address is required")
    private String guestAddress;
    
    @NotBlank(message = "Room type is required")
    private String roomType;
    
    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date cannot be in the past")
    private LocalDate checkIn;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOut;
    
    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest is required")
    private Integer numberOfGuests;
    
    private String selectedPackage;
    
    private List<String> foodPreferences;
    
    private String drinkPackage;
    
    private String specialRequests;
}
