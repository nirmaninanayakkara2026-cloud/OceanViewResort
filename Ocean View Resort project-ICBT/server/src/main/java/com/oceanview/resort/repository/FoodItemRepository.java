package com.oceanview.resort.repository;

import com.oceanview.resort.model.FoodItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends MongoRepository<FoodItem, String> {
    
    List<FoodItem> findByAvailableTrue();
    
    List<FoodItem> findByCategoryAndAvailableTrue(String category);
    
    List<FoodItem> findByNameContainingIgnoreCaseAndAvailableTrue(String name);
}
