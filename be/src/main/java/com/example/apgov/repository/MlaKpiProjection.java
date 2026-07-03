package com.example.apgov.repository;

public interface MlaKpiProjection {
    Long getTotal();
    Long getResolved();
    Long getPending();
    Long getVisited();
    Long getAcknowledged();
    Long getEnroute();
    Double getResolutionRate();
    Double getAvgResolutionDays();
}
