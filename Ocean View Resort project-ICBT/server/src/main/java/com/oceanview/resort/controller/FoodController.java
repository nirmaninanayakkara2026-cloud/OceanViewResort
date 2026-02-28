package com.oceanview.resort.controller;

import com.oceanview.resort.dto.ApiResponse;
import com.oceanview.resort.model.FoodItem;
import com.oceanview.resort.model.FoodOrder;
import com.oceanview.resort.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FoodController {
    
    private final FoodService foodService;
    
    // Food Items Endpoints
    @GetMapping("/items")
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodService.getAllFoodItems());
    }
    
    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodService.getFoodItemsByCategory(category));
    }
    
    @GetMapping("/items/search")
    public ResponseEntity<List<FoodItem>> searchFoodItems(@RequestParam String keyword) {
        return ResponseEntity.ok(foodService.searchFoodItems(keyword));
    }
    
    @GetMapping("/items/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(foodService.getFoodItemById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/items")
    public ResponseEntity<ApiResponse> createFoodItem(@RequestBody FoodItem foodItem) {
        try {
            FoodItem created = foodService.createFoodItem(foodItem);
            return ResponseEntity.ok(new ApiResponse(true, "Food item created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse> updateFoodItem(
        @PathVariable String id,
        @RequestBody FoodItem foodItem
    ) {
        try {
            FoodItem updated = foodService.updateFoodItem(id, foodItem);
            return ResponseEntity.ok(new ApiResponse(true, "Food item updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse> deleteFoodItem(@PathVariable String id) {
        try {
            foodService.deleteFoodItem(id);
            return ResponseEntity.ok(new ApiResponse(true, "Food item deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    // Food Orders Endpoints
    @PostMapping("/orders")
    public ResponseEntity<ApiResponse> createOrder(@RequestBody FoodOrder order) {
        try {
            FoodOrder created = foodService.createOrder(order);
            return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        return ResponseEntity.ok(foodService.getAllOrders());
    }
    
    @GetMapping("/orders/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(foodService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<FoodOrder>> getOrdersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(foodService.getOrdersByUser(userId));
    }
    
    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<FoodOrder>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(foodService.getOrdersByStatus(status));
    }
    
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
        @PathVariable String id,
        @RequestParam String status
    ) {
        try {
            FoodOrder updated = foodService.updateOrderStatus(id, status);
            return ResponseEntity.ok(new ApiResponse(true, "Order status updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
