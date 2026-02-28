package com.oceanview.resort.service;

import com.oceanview.resort.dto.BookingRequest;
import com.oceanview.resort.model.Booking;
import com.oceanview.resort.model.Package;
import com.oceanview.resort.model.Room;
import com.oceanview.resort.repository.BookingRepository;
import com.oceanview.resort.repository.PackageRepository;
import com.oceanview.resort.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final PackageRepository packageRepository;
    
    public Booking createBooking(BookingRequest request) {
        // Validate dates
        if (request.getCheckOut().isBefore(request.getCheckIn())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }
        
        // Calculate nights
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        
        // Get room price
        Room room = roomRepository.findByType(request.getRoomType())
            .orElseThrow(() -> new RuntimeException("Room type not found"));
        
        double roomPrice = room.getPricePerNight();
        double totalPrice = roomPrice * nights;
        
        // Add package price
        double packagePrice = 0.0;
        if (request.getSelectedPackage() != null && !request.getSelectedPackage().isEmpty()) {
            Package pkg = packageRepository.findByPackageId(request.getSelectedPackage())
                .orElse(null);
            if (pkg != null) {
                packagePrice = pkg.getPrice();
                totalPrice += packagePrice;
            }
        }
        
        // Add drink package price
        if (request.getDrinkPackage() != null) {
            if (request.getDrinkPackage().equals("basic")) {
                totalPrice += 5000 * nights;
            } else if (request.getDrinkPackage().equals("premium")) {
                totalPrice += 10000 * nights;
            }
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setGuestName(request.getGuestName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setGuestPhone(request.getGuestPhone());
        booking.setGuestAddress(request.getGuestAddress());
        booking.setRoomType(request.getRoomType());
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setNumberOfNights((int) nights);
        booking.setSelectedPackage(request.getSelectedPackage());
        booking.setFoodPreferences(request.getFoodPreferences());
        booking.setDrinkPackage(request.getDrinkPackage());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setRoomPrice(roomPrice);
        booking.setPackagePrice(packagePrice);
        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING");
        booking.setReservationNumber("RES" + generateReservationNumber());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public Booking getBookingByReservationNumber(String reservationNumber) {
        return bookingRepository.findByReservationNumber(reservationNumber)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }
    
    public Booking updateBookingStatus(String id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }
    
    public void cancelBooking(String id) {
        Booking booking = getBookingById(id);
        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);
    }
    
    public boolean checkAvailability(LocalDate checkIn, LocalDate checkOut, String roomType) {
        List<Booking> conflictingBookings = bookingRepository
            .findByRoomTypeAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                roomType, checkOut, checkIn
            );
        
        Room room = roomRepository.findByType(roomType)
            .orElseThrow(() -> new RuntimeException("Room type not found"));
        
        long bookedRooms = conflictingBookings.stream()
            .filter(b -> !b.getStatus().equalsIgnoreCase("CANCELLED"))
            .count();
        
        return bookedRooms < room.getTotalRooms();
    }
    
    private String generateReservationNumber() {
        return String.valueOf(10000 + new Random().nextInt(90000));
    }
}
