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
public class MlaAnalyticsDto {
    private double citizenSatisfactionScore;
    private double rateImprovementPercentage;
    private double resolutionRate;
    private List<MonthlyTrendPoint> monthlyTrend;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrendPoint {
        private String month;
        private long raised;
        private long resolved;
    }
}
