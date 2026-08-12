package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    
    // Citizen login field (optional)
    private String phone;
    
    // Field Officer, Coordinator, and MLA login field (optional)
    private String employeeId;
    
    // General SSO login field (optional)
    private String ssoUid;
    
    // OTP used for Citizens, Field Officers, and Coordinators
    private String otp;
    
    // Passcode used for MLA (e.g., "2026")
    private String passcode;

    // Optional name passed during citizen mobile onboarding
    private String name;
}
