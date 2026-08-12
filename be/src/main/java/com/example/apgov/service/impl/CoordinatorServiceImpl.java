package com.example.apgov.service.impl;

import com.example.apgov.dto.*;
import com.example.apgov.entity.*;
import com.example.apgov.repository.*;
import com.example.apgov.service.CoordinatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CoordinatorServiceImpl implements CoordinatorService {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceAssignmentRepository assignmentRepository;
    private final FieldOfficerProfileRepository foProfileRepository;
    private final GrievanceTimelineRepository timelineRepository;
    private final GrievanceAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public CoordinatorServiceImpl(
            GrievanceRepository grievanceRepository,
            GrievanceAssignmentRepository assignmentRepository,
            FieldOfficerProfileRepository foProfileRepository,
            GrievanceTimelineRepository timelineRepository,
            GrievanceAttachmentRepository attachmentRepository,
            UserRepository userRepository
    ) {
        this.grievanceRepository = grievanceRepository;
        this.assignmentRepository = assignmentRepository;
        this.foProfileRepository = foProfileRepository;
        this.timelineRepository = timelineRepository;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CoordinatorKpisDto getKpis(Users user) {
        String constituencyId = getConstituencyId(user);

        long unassignedCount = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Pending");
        long inProgressCount = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Acknowledged")
                + grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "EnRoute")
                + grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Visited");
        long resolvedCount = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Resolved");

        List<FieldOfficerProfiles> foProfiles = foProfileRepository.findByAssignedConstituencyId(constituencyId);
        long activeFoCount = foProfiles.size();

        // Urgent unassigned: find 'Pending' issues with urgency 'High'
        List<Grievances> pendingGrievances = grievanceRepository.findByConstituencyIdAndStatusOrderByCreatedAtDesc(constituencyId, "Pending");
        long urgentUnassigned = pendingGrievances.stream().filter(g -> "High".equalsIgnoreCase(g.getUrgency())).count();

        return CoordinatorKpisDto.builder()
                .unassignedCount(unassignedCount)
                .activeFoCount(activeFoCount)
                .inProgressCount(inProgressCount)
                .resolvedCount(resolvedCount)
                .urgentUnassignedCount(urgentUnassigned)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitizenGrievanceDto> getGrievances(String status, String urgency, String villageId, String search, Users user) {
        String constituencyId = getConstituencyId(user);
        List<Grievances> list;

        if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
            list = grievanceRepository.findByConstituencyIdAndStatusOrderByCreatedAtDesc(constituencyId, status);
        } else {
            list = grievanceRepository.findByConstituencyIdOrderByCreatedAtDesc(constituencyId);
        }

        return list.stream()
                .filter(g -> {
                    if (urgency != null && !urgency.isBlank() && !"all".equalsIgnoreCase(urgency)) {
                        if (!urgency.equalsIgnoreCase(g.getUrgency())) return false;
                    }
                    if (villageId != null && !villageId.isBlank() && !"all".equalsIgnoreCase(villageId)) {
                        if (g.getVillage() != null && !villageId.equalsIgnoreCase(g.getVillage().getId()) && !villageId.equalsIgnoreCase(g.getVillage().getName())) {
                            return false;
                        }
                    }
                    if (search != null && !search.isBlank()) {
                        String s = search.toLowerCase();
                        boolean matchTitle = g.getTitle() != null && g.getTitle().toLowerCase().contains(s);
                        boolean matchDesc = g.getDescription() != null && g.getDescription().toLowerCase().contains(s);
                        boolean matchRef = g.getReferenceCode() != null && g.getReferenceCode().toLowerCase().contains(s);
                        if (!matchTitle && !matchDesc && !matchRef) return false;
                    }
                    return true;
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CitizenGrievanceDto getGrievanceById(String grievanceId, Users user) {
        Grievances grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found: " + grievanceId));
        return mapToDto(grievance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FieldOfficerWorkloadDto> getFieldOfficers(Users user) {
        String constituencyId = getConstituencyId(user);
        List<FieldOfficerProfiles> profiles = foProfileRepository.findByAssignedConstituencyId(constituencyId);

        return profiles.stream().map(fo -> {
            Users u = fo.getUser();
            String name = u != null ? u.getFirstName() + " " + (u.getLastName() != null ? u.getLastName() : "") : "Field Officer";
            String phone = u != null ? u.getPhone() : "";
            String designation = fo.getDesignation() != null ? fo.getDesignation() : "Field Officer · Kuppam";
            String village = "Kuppam Town";

            // Count tasks
            long activeTasks = assignmentRepository.countActiveTasksByFieldOfficerId(fo.getId());
            long resolvedTasks = assignmentRepository.countResolvedTasksByFieldOfficerId(fo.getId());

            String status = "Available";
            if (activeTasks >= 8) {
                status = "Overloaded";
            } else if (activeTasks >= 4) {
                status = "Busy";
            }

            // Fetch active task titles
            List<GrievanceAssignments> assignments = assignmentRepository.findByFieldOfficerIdOrderByStopSequenceAsc(fo.getId());
            List<String> taskTitles = assignments.stream()
                    .filter(a -> !"Resolved".equalsIgnoreCase(a.getStatus()))
                    .map(a -> a.getGrievance() != null ? a.getGrievance().getTitle() : "Task")
                    .limit(5)
                    .collect(Collectors.toList());

            return FieldOfficerWorkloadDto.builder()
                    .id(u != null && u.getEmployeeId() != null ? u.getEmployeeId() : fo.getId())
                    .name(name)
                    .designation(designation)
                    .village(village)
                    .phone(phone)
                    .status(status)
                    .activeTasks((int) activeTasks)
                    .resolvedTasks((int) resolvedTasks)
                    .avgCloseTime("2.4d")
                    .tasksList(taskTitles)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CitizenGrievanceDto assignGrievance(AssignGrievanceRequest request, Users user) {
        if (request.getGrievanceId() == null || request.getGrievanceId().isBlank()) {
            throw new IllegalArgumentException("Grievance ID is required.");
        }
        if (request.getFieldOfficerId() == null || request.getFieldOfficerId().isBlank()) {
            throw new IllegalArgumentException("Field Officer ID is required.");
        }

        Grievances grievance = grievanceRepository.findById(request.getGrievanceId())
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found: " + request.getGrievanceId()));

        // Lookup FO Profile by employeeId or profile ID or User ID
        FieldOfficerProfiles foProfile = foProfileRepository.findById(request.getFieldOfficerId()).orElse(null);
        if (foProfile == null) {
            Optional<Users> foUser = userRepository.findByEmployeeId(request.getFieldOfficerId());
            if (foUser.isPresent()) {
                foProfile = foProfileRepository.findByUserId(foUser.get().getId()).orElse(null);
            }
        }
        if (foProfile == null) {
            Optional<FieldOfficerProfiles> byUser = foProfileRepository.findByUserId(request.getFieldOfficerId());
            if (byUser.isPresent()) {
                foProfile = byUser.get();
            }
        }
        if (foProfile == null) {
            List<FieldOfficerProfiles> all = foProfileRepository.findAll();
            if (!all.isEmpty()) {
                foProfile = all.get(0);
            } else {
                throw new IllegalStateException("No field officer profile found.");
            }
        }

        // Check if existing assignment exists
        Optional<GrievanceAssignments> existingAssign = assignmentRepository.findByGrievanceId(grievance.getId());
        GrievanceAssignments assignment;

        Integer stopSequence = request.getStopSequence() != null ? request.getStopSequence() : 1;
        LocalDate assignDate = request.getAssignmentDate() != null ? request.getAssignmentDate() : LocalDate.now();

        if (existingAssign.isPresent()) {
            assignment = existingAssign.get();
            assignment.setFieldOfficerId(foProfile.getId());
            assignment.setFieldOfficer(foProfile);
            assignment.setStopSequence(stopSequence);
            assignment.setAssignmentDate(assignDate);
            assignment.setStatus("EnRoute");
            if (request.getNotes() != null) assignment.setFieldNotes(request.getNotes());
        } else {
            assignment = GrievanceAssignments.builder()
                    .id(UUID.randomUUID().toString())
                    .grievance(grievance)
                    .fieldOfficerId(foProfile.getId())
                    .fieldOfficer(foProfile)
                    .stopSequence(stopSequence)
                    .assignmentDate(assignDate)
                    .status("EnRoute")
                    .fieldNotes(request.getNotes())
                    .build();
        }

        assignmentRepository.save(assignment);

        // Update grievance status to 'EnRoute' or 'Acknowledged'
        grievance.setStatus("EnRoute");
        Grievances saved = grievanceRepository.save(grievance);

        // Log timeline entry
        String foName = foProfile.getUser() != null ? foProfile.getUser().getFirstName() + " " + foProfile.getUser().getLastName() : "Field Officer";
        GrievanceTimelines timeline = GrievanceTimelines.builder()
                .id(UUID.randomUUID().toString())
                .grievance(saved)
                .actionStatus("EnRoute")
                .actor(user)
                .notes("Assigned to Field Officer " + foName + " for on-site inspection (Stop #" + stopSequence + ")")
                .build();
        timelineRepository.save(timeline);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CoordinatorReportDto getReports(Users user) {
        String constituencyId = getConstituencyId(user);

        long total = grievanceRepository.countByConstituencyId(constituencyId);
        long resolved = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Resolved");
        long pending = total - resolved;
        double rate = total > 0 ? Math.round((resolved * 100.0 / total) * 10.0) / 10.0 : 0.0;

        List<MlaCategoryKpiProjection> catProjections = grievanceRepository.getMlaCategoryKpis(constituencyId);
        List<MlaCategoryKpiDto> categoryDtos = catProjections.stream()
                .map(p -> MlaCategoryKpiDto.builder().category(p.getCategory()).count(p.getCount()).build())
                .collect(Collectors.toList());

        List<MlaVillagePerformanceProjection> vilProjections = grievanceRepository.getMlaVillagePerformance(constituencyId);
        List<MlaVillagePerformanceDto> villageDtos = vilProjections.stream()
                .map(p -> MlaVillagePerformanceDto.builder()
                        .villageName(p.getVillageName())
                        .totalIssues(p.getTotalIssues())
                        .resolvedIssues(p.getResolvedIssues())
                        .resolutionRate(p.getResolutionRate())
                        .build())
                .collect(Collectors.toList());

        return CoordinatorReportDto.builder()
                .mandalName("Kuppam Mandal")
                .totalGrievances(total)
                .resolvedGrievances(resolved)
                .pendingGrievances(pending)
                .resolutionRate(rate)
                .categoryBreakdown(categoryDtos)
                .villageBreakdown(villageDtos)
                .build();
    }

    private String getConstituencyId(Users user) {
        if (user != null && user.getConstituency() != null) {
            return user.getConstituency().getId();
        }
        return "c1"; // fallback
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
