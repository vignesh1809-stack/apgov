package com.example.apgov.controller;

import com.example.apgov.dto.MlaKpisDto;
import com.example.apgov.dto.MlaCategoryKpiDto;
import com.example.apgov.dto.MlaVillagePerformanceDto;
import com.example.apgov.dto.MlaMandalPerformanceDto;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.service.MlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/kpis")
    public ResponseEntity<?> getMlaKpis() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access."));
        }

        Users user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        try {
            MlaKpisDto kpis = mlaService.getMlaKpis(user);
            return ResponseEntity.ok(kpis);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access restricted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/kpis/category")
    public ResponseEntity<?> getMlaCategoryKpis() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access."));
        }

        Users user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        try {
            List<MlaCategoryKpiDto> categoryKpis = mlaService.getMlaCategoryKpis(user);
            return ResponseEntity.ok(categoryKpis);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access restricted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/kpis/village")
    public ResponseEntity<?> getMlaVillagePerformance() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access."));
        }

        Users user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        try {
            List<MlaVillagePerformanceDto> villagePerformance = mlaService.getMlaVillagePerformance(user);
            return ResponseEntity.ok(villagePerformance);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access restricted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/kpis/mandal")
    public ResponseEntity<?> getMlaMandalPerformance() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access."));
        }

        Users user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        try {
            List<MlaMandalPerformanceDto> mandalPerformance = mlaService.getMlaMandalPerformance(user);
            return ResponseEntity.ok(mandalPerformance);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access restricted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}
