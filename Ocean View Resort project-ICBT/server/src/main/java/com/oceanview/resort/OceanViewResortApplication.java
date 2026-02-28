package com.oceanview.resort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OceanViewResortApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(OceanViewResortApplication.class, args);
        System.out.println("Ocean View Resort Backend is running on port 8080");
    }
}