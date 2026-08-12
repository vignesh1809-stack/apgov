package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatorKpisDto {
    private long unassignedCount;
    private long activeFoCount;
    private long inProgressCount;
    private long resolvedCount;
    private long urgentUnassignedCount;
}
