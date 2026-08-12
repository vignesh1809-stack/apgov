package com.example.apgov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGrievanceRequest {
    private String category;
    private String title;
    private String description;
    private String villageId;
    private String villageName;
    private String urgency; // 'Low', 'Medium', 'High'
    private String image; // base64 or storage url
}
