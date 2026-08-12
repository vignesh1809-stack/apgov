package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatorReportDto {
    private String mandalName;
    private long totalGrievances;
    private long resolvedGrievances;
    private long pendingGrievances;
    private double resolutionRate;
    private List<MlaCategoryKpiDto> categoryBreakdown;
    private List<MlaVillagePerformanceDto> villageBreakdown;
}
