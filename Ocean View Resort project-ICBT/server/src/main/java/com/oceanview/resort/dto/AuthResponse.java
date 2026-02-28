package com.oceanview.resort.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    
    private String type = "Bearer";
    
    private String id;
    
    private String fullName;
    
    private String email;
    
    private Set<String> roles;
    
    public AuthResponse(String token, String id, String fullName, String email, Set<String> roles) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }
}
