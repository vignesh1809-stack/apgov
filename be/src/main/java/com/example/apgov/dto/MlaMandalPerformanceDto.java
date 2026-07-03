package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlaMandalPerformanceDto {
    private String mandalId;
    private String mandalName;

    private Metrics metrics;
    private Status status;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metrics {
        private long totalGrievances;
        private long resolvedGrievances;
        private long pendingGrievances;
        private long inProgressGrievances;
        private double resolutionRate;
        private double avgResolutionDays;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Status {
        private String performanceLevel; // EXCELLENT, STABLE, NEEDS_ATTENTION
        private String colorCode; // Hex color code
    }
}
