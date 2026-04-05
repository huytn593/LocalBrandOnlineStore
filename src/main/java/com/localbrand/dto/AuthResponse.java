package com.localbrand.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String role;
    private String name;
    private String avatarUrl;
    
    public AuthResponse(String token, String email, String role, String name, String avatarUrl) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }
}
