package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignGrievanceRequest {
    private String grievanceId;
    private String fieldOfficerId;
    private Integer stopSequence;
    private LocalDate assignmentDate;
    private String notes;
}
