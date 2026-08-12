package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineItemDto {
    private String id;
    private String actionStatus;
    private String label;
    private String actorName;
    private String actorRole;
    private String notes;
    private String timestamp;
}
