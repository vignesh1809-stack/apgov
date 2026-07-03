package com.example.apgov.service;

import com.example.apgov.dto.MlaKpisDto;
import com.example.apgov.dto.MlaCategoryKpiDto;
import com.example.apgov.dto.MlaVillagePerformanceDto;
import com.example.apgov.dto.MlaMandalPerformanceDto;
import com.example.apgov.entity.Users;
import java.util.List;

public interface MlaService {
    MlaKpisDto getMlaKpis(Users user);
    List<MlaCategoryKpiDto> getMlaCategoryKpis(Users user);
    List<MlaVillagePerformanceDto> getMlaVillagePerformance(Users user);
    List<MlaMandalPerformanceDto> getMlaMandalPerformance(Users user);
}
