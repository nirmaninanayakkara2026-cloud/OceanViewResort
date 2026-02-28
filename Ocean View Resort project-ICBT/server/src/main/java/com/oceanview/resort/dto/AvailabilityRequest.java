package com.oceanview.resort.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequest {
    
    private LocalDate checkIn;
    
    private LocalDate checkOut;
    
    private String roomType;
    
    private Integer guests;
}
