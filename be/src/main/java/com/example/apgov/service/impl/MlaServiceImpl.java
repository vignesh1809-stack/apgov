package com.example.apgov.service.impl;

import com.example.apgov.dto.MlaKpisDto;
import com.example.apgov.dto.MlaCategoryKpiDto;
import com.example.apgov.dto.MlaVillagePerformanceDto;
import com.example.apgov.dto.MlaMandalPerformanceDto;
import com.example.apgov.entity.Users;
import com.example.apgov.repository.GrievanceRepository;
import com.example.apgov.repository.MlaKpiProjection;
import com.example.apgov.repository.MlaCategoryKpiProjection;
import com.example.apgov.repository.MlaVillagePerformanceProjection;
import com.example.apgov.repository.MlaMandalPerformanceProjection;
import com.example.apgov.service.MlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MlaServiceImpl implements MlaService {

    private final GrievanceRepository grievanceRepository;

    @Autowired
    public MlaServiceImpl(GrievanceRepository grievanceRepository) {
        this.grievanceRepository = grievanceRepository;
    }

    @Override
    public MlaKpisDto getMlaKpis(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        if (!"mla".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Access restricted to MLAs only.");
        }

        if (user.getConstituency() == null) {
            throw new IllegalStateException("MLA user is not associated with any constituency.");
        }

        String constituencyId = user.getConstituency().getId();
        MlaKpiProjection projection = grievanceRepository.getMlaKpis(constituencyId);

        if (projection == null) {
            return MlaKpisDto.builder()
                    .total(0)
                    .resolved(0)
                    .pending(0)
                    .visited(0)
                    .acknowledged(0)
                    .enroute(0)
                    .resolutionRate(0.0)
                    .avgResolutionDays(0.0)
                    .build();
        }

        return MlaKpisDto.builder()
                .total(projection.getTotal() != null ? projection.getTotal() : 0)
                .resolved(projection.getResolved() != null ? projection.getResolved() : 0)
                .pending(projection.getPending() != null ? projection.getPending() : 0)
                .visited(projection.getVisited() != null ? projection.getVisited() : 0)
                .acknowledged(projection.getAcknowledged() != null ? projection.getAcknowledged() : 0)
                .enroute(projection.getEnroute() != null ? projection.getEnroute() : 0)
                .resolutionRate(projection.getResolutionRate() != null ? projection.getResolutionRate() : 0.0)
                .avgResolutionDays(projection.getAvgResolutionDays() != null ? projection.getAvgResolutionDays() : 0.0)
                .build();
    }

    @Override
    public List<MlaCategoryKpiDto> getMlaCategoryKpis(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        if (!"mla".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Access restricted to MLAs only.");
        }

        if (user.getConstituency() == null) {
            throw new IllegalStateException("MLA user is not associated with any constituency.");
        }

        String constituencyId = user.getConstituency().getId();
        List<MlaCategoryKpiProjection> projections = grievanceRepository.getMlaCategoryKpis(constituencyId);

        return projections.stream()
                .map(proj -> MlaCategoryKpiDto.builder()
                        .category(proj.getCategory())
                        .count(proj.getCount() != null ? proj.getCount() : 0L)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MlaVillagePerformanceDto> getMlaVillagePerformance(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        if (!"mla".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Access restricted to MLAs only.");
        }

        if (user.getConstituency() == null) {
            throw new IllegalStateException("MLA user is not associated with any constituency.");
        }

        String constituencyId = user.getConstituency().getId();
        List<MlaVillagePerformanceProjection> projections = grievanceRepository.getMlaVillagePerformance(constituencyId);

        return projections.stream()
                .map(proj -> MlaVillagePerformanceDto.builder()
                        .villageName(proj.getVillageName())
                        .totalIssues(proj.getTotalIssues() != null ? proj.getTotalIssues() : 0L)
                        .resolvedIssues(proj.getResolvedIssues() != null ? proj.getResolvedIssues() : 0L)
                        .resolutionRate(proj.getResolutionRate() != null ? proj.getResolutionRate() : 0.0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MlaMandalPerformanceDto> getMlaMandalPerformance(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        if (!"mla".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Access restricted to MLAs only.");
        }

        if (user.getConstituency() == null) {
            throw new IllegalStateException("MLA user is not associated with any constituency.");
        }

        String constituencyId = user.getConstituency().getId();
        List<MlaMandalPerformanceProjection> projections = grievanceRepository.getMlaMandalPerformance(constituencyId);

        return projections.stream()
                .map(proj -> {
                    double rate = proj.getResolutionRate() != null ? proj.getResolutionRate() : 0.0;
                    String level = "NEEDS_ATTENTION";
                    String color = "#F87171";
                    if (rate >= 80.0) {
                        level = "EXCELLENT";
                        color = "#4ADE80";
                    } else if (rate >= 60.0) {
                        level = "STABLE";
                        color = "#FFD700";
                    }

                    return MlaMandalPerformanceDto.builder()
                            .mandalId(proj.getMandalId())
                            .mandalName(proj.getMandalName())
                            .metrics(MlaMandalPerformanceDto.Metrics.builder()
                                    .totalGrievances(proj.getTotalGrievances() != null ? proj.getTotalGrievances() : 0L)
                                    .resolvedGrievances(proj.getResolvedGrievances() != null ? proj.getResolvedGrievances() : 0L)
                                    .pendingGrievances(proj.getPendingGrievances() != null ? proj.getPendingGrievances() : 0L)
                                    .inProgressGrievances(proj.getInProgressGrievances() != null ? proj.getInProgressGrievances() : 0L)
                                    .resolutionRate(rate)
                                    .avgResolutionDays(proj.getAvgResolutionDays() != null ? proj.getAvgResolutionDays() : 0.0)
                                    .build())
                            .status(MlaMandalPerformanceDto.Status.builder()
                                    .performanceLevel(level)
                                    .colorCode(color)
                                    .build())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
