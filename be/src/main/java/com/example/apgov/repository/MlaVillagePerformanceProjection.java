package com.example.apgov.repository;

public interface MlaVillagePerformanceProjection {
    String getVillageName();
    Long getTotalIssues();
    Long getResolvedIssues();
    Double getResolutionRate();
}
