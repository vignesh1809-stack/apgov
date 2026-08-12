package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldOfficerStatsDto {
    private int totalAssigned;
    private int resolvedCount;
    private int visitedCount;
    private int pendingCount;
    private double completionRate;
    private double avgResolutionDays;
    private double satisfactionRating;
}
