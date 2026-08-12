package com.example.apgov.controller;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.service.CitizenService;
import com.example.apgov.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
public class CitizenController {

    private final CitizenService citizenService;
    private final CommonService commonService;

    @Autowired
    public CitizenController(CitizenService citizenService, CommonService commonService) {
        this.citizenService = citizenService;
        this.commonService = commonService;
    }

    private Users getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenStatsDto stats = citizenService.getStats(user);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/grievances")
    public ResponseEntity<?> getMyGrievances() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<CitizenGrievanceDto> grievances = citizenService.getMyGrievances(user);
            return ResponseEntity.ok(grievances);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/grievances/{id}")
    public ResponseEntity<?> getGrievanceById(@PathVariable("id") String id) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenGrievanceDto grievance = citizenService.getGrievanceById(id, user);
            return ResponseEntity.ok(grievance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/grievances")
    public ResponseEntity<?> createGrievance(@RequestBody CreateGrievanceRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenGrievanceDto created = citizenService.createGrievance(request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/grievances/{id}/withdraw")
    public ResponseEntity<?> withdrawGrievance(@PathVariable("id") String id) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenGrievanceDto updated = citizenService.withdrawGrievance(id, user);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            citizenService.bookAppointment(request, user);
            return ResponseEntity.ok(Map.of("message", "Appointment request received successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/villages")
    public ResponseEntity<?> getVillages() {
        Users user = getAuthenticatedUser();
        try {
            List<VillageOptionDto> villages = commonService.getVillages(user);
            return ResponseEntity.ok(villages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
