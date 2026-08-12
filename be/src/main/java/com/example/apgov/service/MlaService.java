package com.example.apgov.service;

import com.example.apgov.dto.*;
import com.example.apgov.entity.Users;
import java.util.List;

public interface MlaService {
    MlaKpisDto getMlaKpis(Users user);
    List<MlaCategoryKpiDto> getMlaCategoryKpis(Users user);
    List<MlaVillagePerformanceDto> getMlaVillagePerformance(Users user);
    List<MlaMandalPerformanceDto> getMlaMandalPerformance(Users user);
    MlaAnalyticsDto getMlaAnalytics(Users user);
    List<CitizenGrievanceDto> getConstituencyGrievances(String villageId, String status, String category, Users user);
    CitizenGrievanceDto resolveGrievance(String grievanceId, MlaResolveGrievanceRequest request, Users user);
    CitizenGrievanceDto addComment(String grievanceId, MlaCommentRequest request, Users user);
}
