package com.oceanview.resort.repository;

import com.oceanview.resort.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    
    List<Room> findByActiveTrue();
    
    Optional<Room> findByType(String type);
    
    List<Room> findByTypeAndActiveTrue(String type);
}
