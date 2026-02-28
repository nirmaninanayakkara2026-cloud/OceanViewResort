package com.oceanview.resort.repository;

import com.oceanview.resort.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByUserId(String userId);
    
    List<Booking> findByGuestEmail(String guestEmail);
    
    Optional<Booking> findByReservationNumber(String reservationNumber);
    
    List<Booking> findByStatus(String status);
    
    List<Booking> findByRoomTypeAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
        String roomType, LocalDate checkOut, LocalDate checkIn
    );
}
