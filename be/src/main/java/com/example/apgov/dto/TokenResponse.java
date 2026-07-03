package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    
    private String accessToken;
    private String refreshToken;
    
    // User Profile fields to match the React frontend's Redux state
    private String name;
    private String role;
    private String constituency;
    private String designation;
    private String phone;
    private String email;
    private String party;
    private String status;
}
