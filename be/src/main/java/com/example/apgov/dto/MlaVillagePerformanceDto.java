package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlaVillagePerformanceDto {
    private String villageName;
    private long totalIssues;
    private long resolvedIssues;
    private double resolutionRate;
}
