package com.example.apgov.controller;

import com.example.apgov.dto.LoginRequest;
import com.example.apgov.dto.RefreshTokenRequest;
import com.example.apgov.dto.TokenResponse;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.security.CustomUserDetailsService;
import com.example.apgov.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(CustomUserDetailsService userDetailsService, JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserDetails userDetails = null;

            // 1. SSO Login Flow
            if (request.getSsoUid() != null && !request.getSsoUid().isBlank()) {
                userDetails = userDetailsService.loadUserBySsoUid(request.getSsoUid());
            } 
            // 2. MLA / Field Officer / Coordinator Login via Employee ID
            else if (request.getEmployeeId() != null && !request.getEmployeeId().isBlank()) {
                userDetails = userDetailsService.loadUserByEmployeeId(request.getEmployeeId());
                
                // For MLA, check the secure passcode ("2026" as used in frontend)
                Users user = ((CustomUserDetails) userDetails).getUser();
                if ("mla".equalsIgnoreCase(user.getRole())) {
                    if (request.getPasscode() == null || !request.getPasscode().equals("2026")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid secure passcode for MLA"));
                    }
                } else {
                    // For Field Officers and Coordinators, validate OTP (accept "483" or any 6-digit OTP for dev)
                    if (request.getOtp() == null || request.getOtp().isBlank()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "OTP is required for login"));
                    }
                }
            } 
            // 3. Citizen / MLA Login via Phone Number
            else if (request.getPhone() != null && !request.getPhone().isBlank()) {
                userDetails = loadUserByPhoneOrFormattedPhone(request.getPhone());
                Users user = ((CustomUserDetails) userDetails).getUser();
                
                if ("mla".equalsIgnoreCase(user.getRole())) {
                    // For MLA logging in by phone, validate the secure passcode (e.g., "2026")
                    if (request.getPasscode() == null || !request.getPasscode().equals("2026")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid secure passcode for MLA"));
                    }
                } else {
                    // For Citizens and other roles, validate OTP (accept "483" or any 6-digit OTP for development)
                    if (request.getOtp() == null || request.getOtp().isBlank()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "OTP is required for login"));
                    }
                }
            }

            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid login parameters. Provide phone, employeeId, or ssoUid."));
            }

            // Generate JWT Tokens
            Users user = ((CustomUserDetails) userDetails).getUser();
            String fullName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
            
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", user.getRole());
            extraClaims.put("name", fullName);
            extraClaims.put("phone", user.getPhone());

            String accessToken = jwtService.generateAccessToken(userDetails, extraClaims);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            // Construct Response
            String constituencyName = "Ramachandrapuram";
            if (user.getConstituency() != null) {
                constituencyName = user.getConstituency().getName();
            }

            String designation = "Citizen · " + constituencyName;
            String party = "AP Citizen";
            
            if ("mla".equalsIgnoreCase(user.getRole())) {
                designation = "MLA · " + constituencyName;
                party = "AP MLA";
            } else if ("fieldofficer".equalsIgnoreCase(user.getRole())) {
                designation = "Field Officer · " + constituencyName;
                party = "Field Officer";
            } else if ("coordinator".equalsIgnoreCase(user.getRole())) {
                designation = "Mandal Coordinator · " + constituencyName;
                party = "Mandal Coordinator";
            }

            TokenResponse response = TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .name(fullName)
                    .role(user.getRole())
                    .constituency(constituencyName + " Constituency")
                    .designation(designation)
                    .phone(user.getPhone())
                    .email(user.getFirstName().toLowerCase() + "@ap.gov.in")
                    .party(party)
                    .status("Active")
                    .build();

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during authentication: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            if (refreshToken == null || refreshToken.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Refresh token is required"));
            }

            String userId = jwtService.extractUsername(refreshToken);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid refresh token"));
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Expired or invalid refresh token"));
            }

            // Generate new access token
            Users user = ((CustomUserDetails) userDetails).getUser();
            String fullName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
            
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", user.getRole());
            extraClaims.put("name", fullName);
            extraClaims.put("phone", user.getPhone());

            String newAccessToken = jwtService.generateAccessToken(userDetails, extraClaims);

            String constituencyName = "Ramachandrapuram";
            if (user.getConstituency() != null) {
                constituencyName = user.getConstituency().getName();
            }

            String designation = "Citizen · " + constituencyName;
            String party = "AP Citizen";
            
            if ("mla".equalsIgnoreCase(user.getRole())) {
                designation = "MLA · " + constituencyName;
                party = "AP MLA";
            } else if ("fieldofficer".equalsIgnoreCase(user.getRole())) {
                designation = "Field Officer · " + constituencyName;
                party = "Field Officer";
            } else if ("coordinator".equalsIgnoreCase(user.getRole())) {
                designation = "Mandal Coordinator · " + constituencyName;
                party = "Mandal Coordinator";
            }

            TokenResponse response = TokenResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // Return same refresh token
                    .name(fullName)
                    .role(user.getRole())
                    .constituency(constituencyName + " Constituency")
                    .designation(designation)
                    .phone(user.getPhone())
                    .email(user.getFirstName().toLowerCase() + "@ap.gov.in")
                    .party(party)
                    .status("Active")
                    .build();

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not found: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during token refresh: " + e.getMessage()));
        }
    }

    private UserDetails loadUserByPhoneOrFormattedPhone(String phone) {
        String cleanPhone = phone.replaceAll("\\s+", ""); // remove spaces
        try {
            return userDetailsService.loadUserByPhone(cleanPhone);
        } catch (UsernameNotFoundException e) {
            // Try prepending +91 if not present
            if (!cleanPhone.startsWith("+91")) {
                try {
                    return userDetailsService.loadUserByPhone("+91" + cleanPhone);
                } catch (UsernameNotFoundException ex) {
                    // Ignore
                }
            } else {
                // Try removing +91 if present
                try {
                    return userDetailsService.loadUserByPhone(cleanPhone.substring(3));
                } catch (UsernameNotFoundException ex) {
                    // Ignore
                }
            }
            throw e; // Rethrow original if still not found
        }
    }
}
