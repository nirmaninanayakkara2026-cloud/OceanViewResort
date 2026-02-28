package com.oceanview.resort.service;

import com.oceanview.resort.model.FoodItem;
import com.oceanview.resort.model.FoodOrder;
import com.oceanview.resort.repository.FoodItemRepository;
import com.oceanview.resort.repository.FoodOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {
    
    private final FoodItemRepository foodItemRepository;
    private final FoodOrderRepository foodOrderRepository;
    
    // Food Items
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findByAvailableTrue();
    }
    
    public List<FoodItem> getFoodItemsByCategory(String category) {
        return foodItemRepository.findByCategoryAndAvailableTrue(category);
    }
    
    public List<FoodItem> searchFoodItems(String keyword) {
        return foodItemRepository.findByNameContainingIgnoreCaseAndAvailableTrue(keyword);
    }
    
    public FoodItem getFoodItemById(String id) {
        return foodItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Food item not found"));
    }
    
    public FoodItem createFoodItem(FoodItem foodItem) {
        foodItem.setAvailable(true);
        return foodItemRepository.save(foodItem);
    }
    
    public FoodItem updateFoodItem(String id, FoodItem foodItemDetails) {
        FoodItem foodItem = getFoodItemById(id);
        
        foodItem.setName(foodItemDetails.getName());
        foodItem.setCategory(foodItemDetails.getCategory());
        foodItem.setPrice(foodItemDetails.getPrice());
        foodItem.setDescription(foodItemDetails.getDescription());
        foodItem.setImage(foodItemDetails.getImage());
        foodItem.setAvailable(foodItemDetails.isAvailable());
        
        return foodItemRepository.save(foodItem);
    }
    
    public void deleteFoodItem(String id) {
        FoodItem foodItem = getFoodItemById(id);
        foodItem.setAvailable(false);
        foodItemRepository.save(foodItem);
    }
    
    // Food Orders
    public FoodOrder createOrder(FoodOrder order) {
        order.setStatus("pending");
        order.setOrderedAt(LocalDateTime.now());
        return foodOrderRepository.save(order);
    }
    
    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }
    
    public FoodOrder getOrderById(String id) {
        return foodOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public List<FoodOrder> getOrdersByUser(String userId) {
        return foodOrderRepository.findByUserId(userId);
    }
    
    public List<FoodOrder> getOrdersByStatus(String status) {
        return foodOrderRepository.findByStatus(status);
    }
    
    public FoodOrder updateOrderStatus(String id, String status) {
        FoodOrder order = getOrderById(id);
        order.setStatus(status);
        
        if (status.equals("delivered")) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        return foodOrderRepository.save(order);
    }
}
