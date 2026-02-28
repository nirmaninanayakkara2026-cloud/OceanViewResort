package com.oceanview.resort.repository;

import com.oceanview.resort.model.FoodOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodOrderRepository extends MongoRepository<FoodOrder, String> {
    
    List<FoodOrder> findByUserId(String userId);
    
    List<FoodOrder> findByStatus(String status);
    
    List<FoodOrder> findByRoomNumber(String roomNumber);
}
