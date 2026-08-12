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
public class FieldOfficerAssignmentDto {
    private String id;
    private String grievanceId;
    private Integer stopNum;
    private String citizenName;
    private String phone;
    private String address;
    private String category;
    private String title;
    private String description;
    private String village;
    private String ward;
    private String urgency;
    private String status; // 'Pending', 'EnRoute', 'Visited', 'Resolved'
    private String time;
    private String distance;
    private String notes;
    private Boolean photoUploaded;
    private String checkedInAt;
    private List<String> attachments;
}
