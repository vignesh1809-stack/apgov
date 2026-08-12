package com.example.apgov.controller;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.service.FieldOfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/field-officer")
public class FieldOfficerController {

    private final FieldOfficerService fieldOfficerService;

    @Autowired
    public FieldOfficerController(FieldOfficerService fieldOfficerService) {
        this.fieldOfficerService = fieldOfficerService;
    }

    private Users getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping("/assignments")
    public ResponseEntity<?> getAssignments() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<FieldOfficerAssignmentDto> list = fieldOfficerService.getAssignments(user);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable("id") String id) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            FieldOfficerAssignmentDto dto = fieldOfficerService.getAssignmentById(id, user);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            FieldOfficerStatsDto stats = fieldOfficerService.getStats(user);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assignments/{id}/checkin")
    public ResponseEntity<?> checkIn(@PathVariable("id") String id) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            FieldOfficerAssignmentDto dto = fieldOfficerService.checkIn(id, user);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/assignments/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") String id, @RequestBody UpdateAssignmentStatusRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            FieldOfficerAssignmentDto dto = fieldOfficerService.updateStatus(id, request, user);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assignments/{id}/escalate")
    public ResponseEntity<?> escalate(@PathVariable("id") String id, @RequestBody EscalateGrievanceRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            FieldOfficerAssignmentDto dto = fieldOfficerService.escalate(id, request, user);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
