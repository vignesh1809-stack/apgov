package com.example.apgov.controller;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.service.MlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mla")
public class MlaController {

    private final MlaService mlaService;

    @Autowired
    public MlaController(MlaService mlaService) {
        this.mlaService = mlaService;
    }

    private Users getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping("/kpis")
    public ResponseEntity<?> getMlaKpis() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            MlaKpisDto kpis = mlaService.getMlaKpis(user);
            return ResponseEntity.ok(kpis);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/kpis/category")
    public ResponseEntity<?> getMlaCategoryKpis() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<MlaCategoryKpiDto> categoryKpis = mlaService.getMlaCategoryKpis(user);
            return ResponseEntity.ok(categoryKpis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/kpis/village")
    public ResponseEntity<?> getMlaVillagePerformance() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<MlaVillagePerformanceDto> villagePerformance = mlaService.getMlaVillagePerformance(user);
            return ResponseEntity.ok(villagePerformance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/kpis/mandal")
    public ResponseEntity<?> getMlaMandalPerformance() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<MlaMandalPerformanceDto> mandalPerformance = mlaService.getMlaMandalPerformance(user);
            return ResponseEntity.ok(mandalPerformance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getMlaAnalytics() {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            MlaAnalyticsDto analytics = mlaService.getMlaAnalytics(user);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/grievances")
    public ResponseEntity<?> getConstituencyGrievances(
            @RequestParam(value = "village", required = false) String village,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "category", required = false) String category
    ) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            List<CitizenGrievanceDto> list = mlaService.getConstituencyGrievances(village, status, category, user);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/grievances/{id}/resolve")
    public ResponseEntity<?> resolveGrievance(@PathVariable("id") String id, @RequestBody MlaResolveGrievanceRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenGrievanceDto dto = mlaService.resolveGrievance(id, request, user);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/grievances/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable("id") String id, @RequestBody MlaCommentRequest request) {
        Users user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        try {
            CitizenGrievanceDto dto = mlaService.addComment(id, request, user);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
