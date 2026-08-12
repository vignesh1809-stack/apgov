package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssignmentStatusRequest {
    private String status; // 'EnRoute', 'Visited', 'Resolved'
    private String fieldNotes;
    private String photoStorageUrl;
}
