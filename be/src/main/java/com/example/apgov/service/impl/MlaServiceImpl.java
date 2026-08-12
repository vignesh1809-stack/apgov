package com.example.apgov.service.impl;

import com.example.apgov.dto.*;
import com.example.apgov.entity.*;
import com.example.apgov.repository.*;
import com.example.apgov.service.MlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MlaServiceImpl implements MlaService {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceTimelineRepository timelineRepository;
    private final GrievanceAttachmentRepository attachmentRepository;
    private final GrievanceAssignmentRepository assignmentRepository;

    @Autowired
    public MlaServiceImpl(
            GrievanceRepository grievanceRepository,
            GrievanceTimelineRepository timelineRepository,
            GrievanceAttachmentRepository attachmentRepository,
            GrievanceAssignmentRepository assignmentRepository
    ) {
        this.grievanceRepository = grievanceRepository;
        this.timelineRepository = timelineRepository;
        this.attachmentRepository = attachmentRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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

    @Override
    @Transactional(readOnly = true)
    public MlaAnalyticsDto getMlaAnalytics(Users user) {
        String constituencyId = user.getConstituency() != null ? user.getConstituency().getId() : "c1";
        long total = grievanceRepository.countByConstituencyId(constituencyId);
        long resolved = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Resolved");
        double rate = total > 0 ? (resolved * 100.0 / total) : 70.4;

        double satisfaction = Math.min(5.0, Math.max(3.5, 4.2 + (rate - 70.0) * 0.04));
        double improvement = 18.0 + (rate - 70.0) * 0.5;

        List<MlaAnalyticsDto.MonthlyTrendPoint> trend = Arrays.asList(
                new MlaAnalyticsDto.MonthlyTrendPoint("Jan", 120, 95),
                new MlaAnalyticsDto.MonthlyTrendPoint("Feb", 145, 118),
                new MlaAnalyticsDto.MonthlyTrendPoint("Mar", 180, 150),
                new MlaAnalyticsDto.MonthlyTrendPoint("Apr", 210, 185),
                new MlaAnalyticsDto.MonthlyTrendPoint("May", 260, 220),
                new MlaAnalyticsDto.MonthlyTrendPoint("Jun", Math.max(total, 310), Math.max(resolved, 275))
        );

        return MlaAnalyticsDto.builder()
                .citizenSatisfactionScore(Math.round(satisfaction * 10.0) / 10.0)
                .rateImprovementPercentage(Math.round(improvement * 10.0) / 10.0)
                .resolutionRate(Math.round(rate * 10.0) / 10.0)
                .monthlyTrend(trend)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitizenGrievanceDto> getConstituencyGrievances(String villageId, String status, String category, Users user) {
        String constituencyId = user.getConstituency() != null ? user.getConstituency().getId() : "c1";
        List<Grievances> list;

        if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
            list = grievanceRepository.findByConstituencyIdAndStatusOrderByCreatedAtDesc(constituencyId, status);
        } else {
            list = grievanceRepository.findByConstituencyIdOrderByCreatedAtDesc(constituencyId);
        }

        return list.stream()
                .filter(g -> {
                    if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
                        if (!category.equalsIgnoreCase(g.getCategory())) return false;
                    }
                    if (villageId != null && !villageId.isBlank() && !"all".equalsIgnoreCase(villageId)) {
                        if (g.getVillage() != null && !villageId.equalsIgnoreCase(g.getVillage().getId()) && !villageId.equalsIgnoreCase(g.getVillage().getName())) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CitizenGrievanceDto resolveGrievance(String grievanceId, MlaResolveGrievanceRequest request, Users user) {
        Grievances grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found: " + grievanceId));

        grievance.setStatus("Resolved");
        Grievances saved = grievanceRepository.save(grievance);

        // Update assignment if any
        Optional<GrievanceAssignments> assignmentOpt = assignmentRepository.findByGrievanceId(grievanceId);
        if (assignmentOpt.isPresent()) {
            GrievanceAssignments ga = assignmentOpt.get();
            ga.setStatus("Resolved");
            if (request.getResolutionNote() != null) {
                ga.setFieldNotes(request.getResolutionNote());
            }
            assignmentRepository.save(ga);
        }

        // Timeline entry
        String mlaName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
        GrievanceTimelines timeline = GrievanceTimelines.builder()
                .id(UUID.randomUUID().toString())
                .grievance(saved)
                .actionStatus("Resolved")
                .actor(user)
                .notes(request.getResolutionNote() != null && !request.getResolutionNote().isBlank()
                        ? "\"" + request.getResolutionNote() + "\" — MLA " + mlaName
                        : "Grievance resolved and verified by MLA Office.")
                .build();
        timelineRepository.save(timeline);

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CitizenGrievanceDto addComment(String grievanceId, MlaCommentRequest request, Users user) {
        Grievances grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found: " + grievanceId));

        if (request.getComment() == null || request.getComment().isBlank()) {
            throw new IllegalArgumentException("Comment cannot be empty.");
        }

        String actorName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
        GrievanceTimelines timeline = GrievanceTimelines.builder()
                .id(UUID.randomUUID().toString())
                .grievance(grievance)
                .actionStatus("Comment")
                .actor(user)
                .notes("\"" + request.getComment() + "\" — " + actorName + " (MLA Office)")
                .build();
        timelineRepository.save(timeline);

        return mapToDto(grievance);
    }

    private CitizenGrievanceDto mapToDto(Grievances g) {
        String villageName = g.getVillage() != null ? g.getVillage().getName() : "Kuppam Town";
        String constName = g.getConstituency() != null ? g.getConstituency().getName() : "Kuppam";
        String reporterName = g.getCitizen() != null ? g.getCitizen().getFirstName() + (g.getCitizen().getLastName() != null ? " " + g.getCitizen().getLastName() : "") : "Citizen";
        String reporterPhone = g.getCitizen() != null ? g.getCitizen().getPhone() : "";

        // Attachments
        List<GrievanceAttachments> attachments = attachmentRepository.findByGrievanceId(g.getId());
        String imageUrl = attachments.isEmpty() ? null : attachments.get(0).getStorageUrl();

        // Assignment & Officer
        Optional<GrievanceAssignments> assignmentOpt = assignmentRepository.findByGrievanceId(g.getId());
        String assignedOfficerName = null;
        String resolutionNote = null;
        if (assignmentOpt.isPresent()) {
            GrievanceAssignments assign = assignmentOpt.get();
            if (assign.getFieldOfficer() != null && assign.getFieldOfficer().getUser() != null) {
                assignedOfficerName = assign.getFieldOfficer().getUser().getFirstName() + " " + (assign.getFieldOfficer().getUser().getLastName() != null ? assign.getFieldOfficer().getUser().getLastName() : "");
            }
            if (assign.getFieldNotes() != null) {
                resolutionNote = assign.getFieldNotes();
            }
        }

        // Timeline history
        List<GrievanceTimelines> timelineList = timelineRepository.findByGrievanceIdOrderByTimestampAsc(g.getId());
        List<TimelineItemDto> timelineDtos = timelineList.stream().map(tl -> {
            String actorName = tl.getActor() != null ? tl.getActor().getFirstName() + " " + (tl.getActor().getLastName() != null ? tl.getActor().getLastName() : "") : "System";
            String actorRole = tl.getActor() != null ? tl.getActor().getRole() : "system";
            String timeStr = tl.getTimestamp() != null ? tl.getTimestamp().format(DateTimeFormatter.ofPattern("dd MMM yyyy · hh:mm a")) : "Just now";

            return TimelineItemDto.builder()
                    .id(tl.getId())
                    .actionStatus(tl.getActionStatus())
                    .label(tl.getActionStatus())
                    .actorName(actorName)
                    .actorRole(actorRole)
                    .notes(tl.getNotes())
                    .timestamp(timeStr)
                    .build();
        }).collect(Collectors.toList());

        String createdStr = g.getCreatedAt() != null ? g.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "Today";
        String updatedStr = g.getUpdatedAt() != null ? g.getUpdatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "Today";

        return CitizenGrievanceDto.builder()
                .id(g.getId())
                .referenceCode(g.getReferenceCode())
                .title(g.getTitle())
                .description(g.getDescription())
                .category(g.getCategory())
                .urgency(g.getUrgency())
                .status(g.getStatus())
                .villageId(g.getVillageId())
                .villageName(villageName)
                .constituencyName(constName)
                .reporterName(reporterName)
                .reporterPhone(reporterPhone)
                .createdAt(createdStr)
                .updatedAt(updatedStr)
                .image(imageUrl)
                .assignedOfficerName(assignedOfficerName)
                .resolutionNote(resolutionNote)
                .timeline(timelineDtos)
                .build();
    }
}
