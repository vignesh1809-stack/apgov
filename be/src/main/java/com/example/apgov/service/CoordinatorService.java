package com.example.apgov.service;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import java.util.List;

public interface CoordinatorService {
    CoordinatorKpisDto getKpis(Users user);
    List<CitizenGrievanceDto> getGrievances(String status, String urgency, String villageId, String search, Users user);
    CitizenGrievanceDto getGrievanceById(String grievanceId, Users user);
    List<FieldOfficerWorkloadDto> getFieldOfficers(Users user);
    CitizenGrievanceDto assignGrievance(AssignGrievanceRequest request, Users user);
    CoordinatorReportDto getReports(Users user);
}
