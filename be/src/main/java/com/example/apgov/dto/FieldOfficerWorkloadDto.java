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
public class FieldOfficerWorkloadDto {
    private String id;
    private String name;
    private String designation;
    private String village;
    private String phone;
    private String status; // 'Available', 'Busy', 'Overloaded'
    private int activeTasks;
    private int resolvedTasks;
    private String avgCloseTime;
    private List<String> tasksList;
}
