package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MlaKpisDto {
    private long total;
    private long resolved;
    private long pending;
    private long visited;
    private long acknowledged;
    private long enroute;
    private double resolutionRate;
    private double avgResolutionDays;
}
