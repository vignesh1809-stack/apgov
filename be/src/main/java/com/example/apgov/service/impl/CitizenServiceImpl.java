package com.example.apgov.service.impl;

import com.example.apgov.dto.*;
import com.example.apgov.entity.*;
import com.example.apgov.repository.*;
import com.example.apgov.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CitizenServiceImpl implements CitizenService {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceTimelineRepository timelineRepository;
    private final GrievanceAttachmentRepository attachmentRepository;
    private final GrievanceAssignmentRepository assignmentRepository;
    private final VillageRepository villageRepository;
    private final ConstituencyRepository constituencyRepository;

    @Autowired
    public CitizenServiceImpl(
            GrievanceRepository grievanceRepository,
            GrievanceTimelineRepository timelineRepository,
            GrievanceAttachmentRepository attachmentRepository,
            GrievanceAssignmentRepository assignmentRepository,
            VillageRepository villageRepository,
            ConstituencyRepository constituencyRepository
    ) {
        this.grievanceRepository = grievanceRepository;
        this.timelineRepository = timelineRepository;
        this.attachmentRepository = attachmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.villageRepository = villageRepository;
        this.constituencyRepository = constituencyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CitizenStatsDto getStats(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        String constituencyId = user.getConstituency() != null ? user.getConstituency().getId() : null;
        long myIssuesCount = grievanceRepository.countByCitizenId(user.getId());

        long total = 0;
        long resolved = 0;

        if (constituencyId != null) {
            total = grievanceRepository.countByConstituencyId(constituencyId);
            resolved = grievanceRepository.countByConstituencyIdAndStatus(constituencyId, "Resolved");
        }

        long pending = total - resolved;
        double rate = total > 0 ? Math.round((resolved * 100.0 / total) * 10.0) / 10.0 : 0.0;

        String villageName = "Kuppam";
        if (user.getConstituency() != null) {
            villageName = user.getConstituency().getName();
        }

        return CitizenStatsDto.builder()
                .total(total)
                .resolved(resolved)
                .pending(pending)
                .resolutionRate(rate)
                .myIssuesCount(myIssuesCount)
                .villageName(villageName)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitizenGrievanceDto> getMyGrievances(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        List<Grievances> grievances = grievanceRepository.findByCitizenIdOrderByCreatedAtDesc(user.getId());
        return grievances.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CitizenGrievanceDto getGrievanceById(String grievanceId, Users user) {
        Grievances grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found with ID: " + grievanceId));
        return mapToDto(grievance);
    }

    @Override
    @Transactional
    public CitizenGrievanceDto createGrievance(CreateGrievanceRequest request, Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required.");
        }

        Constituencies constituency = user.getConstituency();
        if (constituency == null) {
            List<Constituencies> allConst = constituencyRepository.findAll();
            if (!allConst.isEmpty()) {
                constituency = allConst.get(0);
            } else {
                throw new IllegalStateException("No constituency configured in database.");
            }
        }

        // Find village
        Villages village = null;
        if (request.getVillageId() != null && !request.getVillageId().isBlank()) {
            village = villageRepository.findById(request.getVillageId()).orElse(null);
        }
        if (village == null && request.getVillageName() != null && !request.getVillageName().isBlank()) {
            village = villageRepository.findByNameIgnoreCaseAndConstituencyId(request.getVillageName().trim(), constituency.getId()).orElse(null);
        }
        if (village == null) {
            List<Villages> villages = villageRepository.findByConstituencyId(constituency.getId());
            if (!villages.isEmpty()) {
                village = villages.get(0);
            } else {
                throw new IllegalStateException("No village found for constituency.");
            }
        }

        String referenceCode = "GRV-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now()) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        String urgency = request.getUrgency() != null ? request.getUrgency() : "Medium";
        String category = request.getCategory() != null ? request.getCategory() : "Road";
        // Map category aliases
        if (category.toLowerCase().contains("road") || category.toLowerCase().contains("infra")) category = "Road";
        else if (category.toLowerCase().contains("water")) category = "Water";
        else if (category.toLowerCase().contains("electr")) category = "Electricity";
        else if (category.toLowerCase().contains("health")) category = "Health";
        else if (category.toLowerCase().contains("educat")) category = "Education";
        else if (category.toLowerCase().contains("env") || category.toLowerCase().contains("civic")) category = "Environment";

        Grievances grievance = new Grievances();
        grievance.setId(UUID.randomUUID().toString());
        grievance.setReferenceCode(referenceCode);
        grievance.setCitizen(user);
        grievance.setCategory(category);
        grievance.setTitle(request.getTitle());
        grievance.setDescription(request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : request.getTitle());
        grievance.setConstituency(constituency);
        grievance.setVillageId(village.getId());
        grievance.setVillage(village);
        grievance.setUrgency(urgency);
        grievance.setStatus("Pending");

        Grievances saved = grievanceRepository.save(grievance);

        // Photo Attachment if provided
        if (request.getImage() != null && !request.getImage().isBlank()) {
            GrievanceAttachments attachment = GrievanceAttachments.builder()
                    .id(UUID.randomUUID().toString())
                    .grievance(saved)
                    .uploaderRole("citizen")
                    .storageUrl(request.getImage())
                    .build();
            attachmentRepository.save(attachment);
        }

        // Timeline: Issue Raised
        GrievanceTimelines timeline = GrievanceTimelines.builder()
                .id(UUID.randomUUID().toString())
                .grievance(saved)
                .actionStatus("Pending")
                .actor(user)
                .notes("Grievance registered by " + user.getFirstName() + " with priority " + urgency)
                .build();
        timelineRepository.save(timeline);

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CitizenGrievanceDto withdrawGrievance(String grievanceId, Users user) {
        Grievances grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found: " + grievanceId));

        grievance.setStatus("Withdrawn");
        Grievances saved = grievanceRepository.save(grievance);

        // Timeline entry
        GrievanceTimelines timeline = GrievanceTimelines.builder()
                .id(UUID.randomUUID().toString())
                .grievance(saved)
                .actionStatus("Withdrawn")
                .actor(user)
                .notes("Grievance withdrawn by citizen.")
                .build();
        timelineRepository.save(timeline);

        return mapToDto(saved);
    }

    @Override
    public void bookAppointment(AppointmentRequest request, Users user) {
        if (request.getDate() == null || request.getDate().isBlank()) {
            throw new IllegalArgumentException("Meeting date is required.");
        }
        if (request.getPurpose() == null || request.getPurpose().isBlank()) {
            throw new IllegalArgumentException("Meeting purpose is required.");
        }
        // In a production system, stores to appointments table or dispatches notification to MLA office staff
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
                assignedOfficerName = assign.getFieldOfficer().getUser().getFirstName() + " " + assign.getFieldOfficer().getUser().getLastName();
            }
            if (assign.getFieldNotes() != null) {
                resolutionNote = assign.getFieldNotes();
            }
        }

        // Timeline history
        List<GrievanceTimelines> timelineList = timelineRepository.findByGrievanceIdOrderByTimestampAsc(g.getId());
        List<TimelineItemDto> timelineDtos = timelineList.stream().map(tl -> {
            String actorName = tl.getActor() != null ? tl.getActor().getFirstName() + " " + tl.getActor().getLastName() : "System";
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
