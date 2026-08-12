package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenGrievanceDto {
    private String id;
    private String referenceCode;
    private String title;
    private String description;
    private String category;
    private String urgency;
    private String status;
    private String villageId;
    private String villageName;
    private String constituencyName;
    private String reporterName;
    private String reporterPhone;
    private String createdAt;
    private String updatedAt;
    private String image;
    private String assignedOfficerName;
    private String resolutionNote;
    private List<TimelineItemDto> timeline;
}
