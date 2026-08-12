package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenStatsDto {
    private long total;
    private long resolved;
    private long pending;
    private double resolutionRate;
    private long myIssuesCount;
    private String villageName;
}
