package com.example.apgov.service;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import java.util.List;

public interface FieldOfficerService {
    List<FieldOfficerAssignmentDto> getAssignments(Users user);
    FieldOfficerAssignmentDto getAssignmentById(String assignmentId, Users user);
    FieldOfficerStatsDto getStats(Users user);
    FieldOfficerAssignmentDto checkIn(String assignmentId, Users user);
    FieldOfficerAssignmentDto updateStatus(String assignmentId, UpdateAssignmentStatusRequest request, Users user);
    FieldOfficerAssignmentDto escalate(String assignmentId, EscalateGrievanceRequest request, Users user);
}
