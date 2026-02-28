package com.oceanview.resort.service;

import com.oceanview.resort.model.Room;
import com.oceanview.resort.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    public List<Room> getAllRooms() {
        return roomRepository.findByActiveTrue();
    }
    
    public Room getRoomById(String id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found"));
    }
    
    public Room getRoomByType(String type) {
        return roomRepository.findByType(type)
            .orElseThrow(() -> new RuntimeException("Room type not found"));
    }
    
    public Room createRoom(Room room) {
        room.setActive(true);
        return roomRepository.save(room);
    }
    
    public Room updateRoom(String id, Room roomDetails) {
        Room room = getRoomById(id);
        
        room.setName(roomDetails.getName());
        room.setType(roomDetails.getType());
        room.setDescription(roomDetails.getDescription());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setCapacity(roomDetails.getCapacity());
        room.setAmenities(roomDetails.getAmenities());
        room.setImageUrl(roomDetails.getImageUrl());
        room.setTotalRooms(roomDetails.getTotalRooms());
        room.setAvailableRooms(roomDetails.getAvailableRooms());
        
        return roomRepository.save(room);
    }
    
    public void deleteRoom(String id) {
        Room room = getRoomById(id);
        room.setActive(false);
        roomRepository.save(room);
    }
}
