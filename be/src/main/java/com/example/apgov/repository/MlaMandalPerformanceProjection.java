package com.example.apgov.repository;

public interface MlaMandalPerformanceProjection {
    String getMandalId();
    String getMandalName();
    Long getTotalGrievances();
    Long getResolvedGrievances();
    Long getPendingGrievances();
    Long getInProgressGrievances();
    Double getResolutionRate();
    Double getAvgResolutionDays();
}
