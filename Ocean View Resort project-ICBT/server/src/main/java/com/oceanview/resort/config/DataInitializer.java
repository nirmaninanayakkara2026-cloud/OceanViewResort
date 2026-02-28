package com.oceanview.resort.config;

import com.oceanview.resort.model.Room;
import com.oceanview.resort.model.FoodItem;
import com.oceanview.resort.model.User;
// Explicitly import our Package class to avoid conflict with java.lang.Package
import com.oceanview.resort.model.Package;
import com.oceanview.resort.repository.RoomRepository;
import com.oceanview.resort.repository.PackageRepository;
import com.oceanview.resort.repository.FoodItemRepository;
import com.oceanview.resort.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final RoomRepository roomRepository;
    private final PackageRepository packageRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user first
        if (userRepository.count() == 0) {
            initializeAdminUser();
        }
        
        // Check if data already exists
        if (roomRepository.count() == 0) {
            initializeRooms();
        }
        
        if (packageRepository.count() == 0) {
            initializePackages();
        }
        
        if (foodItemRepository.count() == 0) {
            initializeFoodItems();
        }
        
        System.out.println("Database initialization completed!");
    }
    
    private void initializeAdminUser() {
        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail("admin@oceanview.com");
        admin.setPassword(passwordEncoder.encode("admin123")); // Default password
        admin.setPhone("+94 77 123 4567");
        admin.setRoles(new java.util.HashSet<>(Arrays.asList("ADMIN")));
        
        userRepository.save(admin);
        System.out.println("Admin user created:");
        System.out.println("  Email: admin@oceanview.com");
        System.out.println("  Password: admin123");
        System.out.println("  ** PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN **");
    }
    
    private void initializeRooms() {
        List<Room> rooms = Arrays.asList(
            new Room(null, "Standard Room", "Standard Room", 
                "Comfortable room with essential amenities", 
                15000.0, 2, 
                Arrays.asList("WiFi", "TV", "Air Conditioning", "Mini Fridge"),
                "🏠", 10, 10, true),
            
            new Room(null, "Deluxe Ocean View", "Deluxe Ocean View",
                "Spacious room with stunning ocean views",
                25000.0, 3,
                Arrays.asList("WiFi", "TV", "Air Conditioning", "Ocean View", "Balcony", "Mini Bar"),
                "🌊", 8, 8, true),
            
            new Room(null, "Suite", "Suite",
                "Luxurious suite with separate living area",
                40000.0, 4,
                Arrays.asList("WiFi", "TV", "Air Conditioning", "Ocean View", "Balcony", "Jacuzzi", "Mini Bar", "King Bed"),
                "👑", 5, 5, true),
            
            new Room(null, "Presidential Suite", "Presidential Suite",
                "Ultimate luxury with premium amenities",
                50000.0, 6,
                Arrays.asList("WiFi", "TV", "Air Conditioning", "Private Pool", "Butler Service", "Ocean View", "Jacuzzi", "Full Kitchen"),
                "💎", 2, 2, true)
        );
        
        roomRepository.saveAll(rooms);
        System.out.println("Rooms initialized: " + rooms.size());
    }
    
    private void initializePackages() {
        List<Package> packages = Arrays.asList(
            new Package(null, "honeymoon", "Honeymoon Package", 25000.0, "💑",
                Arrays.asList("Romantic room setup", "Champagne bottle", "Flower decoration", 
                    "Candlelit dinner", "Couples spa session", "Late checkout"),
                "Perfect for newlyweds", true, true),
            
            new Package(null, "anniversary", "Anniversary Package", 20000.0, "💝",
                Arrays.asList("Anniversary cake", "Rose petals", "Special dinner", 
                    "Champagne", "Photo session", "Room decoration"),
                "Celebrate your special day", false, true),
            
            new Package(null, "birthday", "Birthday Celebration", 15000.0, "🎂",
                Arrays.asList("Birthday cake", "Balloon decoration", "Party setup", 
                    "Special menu", "Complimentary dessert", "Gift voucher"),
                "Make your birthday memorable", false, true),
            
            new Package(null, "family", "Family Fun Package", 18000.0, "👨‍👩‍👧‍👦",
                Arrays.asList("Kids welcome kit", "Family activities", "Board games", 
                    "Movie night setup", "Extra breakfast", "Beach toys"),
                "Fun for the whole family", false, true),
            
            new Package(null, "wellness", "Wellness Retreat", 22000.0, "🧘",
                Arrays.asList("Yoga sessions", "Meditation guide", "Spa treatments", 
                    "Healthy meal plan", "Wellness consultation", "Fitness access"),
                "Rejuvenate your mind and body", false, true),
            
            new Package(null, "adventure", "Adventure Package", 19000.0, "🏄",
                Arrays.asList("Water sports", "Snorkeling gear", "Beach activities", 
                    "Adventure guide", "Equipment rental", "Safety gear"),
                "Thrill and excitement awaits", false, true)
        );
        
        packageRepository.saveAll(packages);
        System.out.println("Packages initialized: " + packages.size());
    }
    
    private void initializeFoodItems() {
        List<FoodItem> foodItems = Arrays.asList(
            // Breakfast
            new FoodItem(null, "Continental Breakfast", "breakfast", 1500.0, 
                "Bread, butter, jam, coffee/tea", "🍞", true),
            new FoodItem(null, "Sri Lankan Breakfast", "breakfast", 1200.0, 
                "String hoppers, curry, sambol", "🍛", true),
            new FoodItem(null, "American Breakfast", "breakfast", 1800.0, 
                "Eggs, bacon, toast, juice", "🍳", true),
            
            // Lunch
            new FoodItem(null, "Rice & Curry", "lunch", 1500.0, 
                "Traditional Sri Lankan rice & curry", "🍛", true),
            new FoodItem(null, "Fried Rice", "lunch", 1300.0, 
                "Chicken/seafood fried rice", "🍚", true),
            new FoodItem(null, "Noodles", "lunch", 1200.0, 
                "Stir-fried noodles with vegetables", "🍜", true),
            new FoodItem(null, "Grilled Fish", "lunch", 2500.0, 
                "Fresh catch of the day", "🐟", true),
            
            // Dinner
            new FoodItem(null, "BBQ Platter", "dinner", 3500.0, 
                "Mixed grill with sides", "🍖", true),
            new FoodItem(null, "Seafood Platter", "dinner", 4000.0, 
                "Prawns, crab, fish selection", "🦞", true),
            new FoodItem(null, "Pasta Special", "dinner", 1800.0, 
                "Chef's special pasta", "🍝", true),
            new FoodItem(null, "Steak", "dinner", 3800.0, 
                "Premium beef steak", "🥩", true),
            
            // Desserts
            new FoodItem(null, "Ice Cream", "dessert", 600.0, 
                "Assorted flavors", "🍨", true),
            new FoodItem(null, "Chocolate Cake", "dessert", 800.0, 
                "Rich chocolate cake", "🍰", true),
            new FoodItem(null, "Fruit Platter", "dessert", 900.0, 
                "Fresh tropical fruits", "🍓", true),
            
            // Beverages
            new FoodItem(null, "Fresh Juice", "beverage", 400.0, 
                "Orange/pineapple/watermelon", "🥤", true),
            new FoodItem(null, "Coffee", "beverage", 300.0, 
                "Espresso/cappuccino/latte", "☕", true),
            new FoodItem(null, "Soft Drinks", "beverage", 200.0, 
                "Coke/Sprite/Fanta", "🥤", true),
            new FoodItem(null, "Cocktails", "beverage", 1200.0, 
                "Signature cocktails", "🍹", true)
        );
        
        foodItemRepository.saveAll(foodItems);
        System.out.println("Food items initialized: " + foodItems.size());
    }
}
