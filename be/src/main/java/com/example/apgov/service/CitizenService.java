package com.example.apgov.service;

import com.example.apgov.dto.AppointmentRequest;
import com.example.apgov.dto.CitizenGrievanceDto;
import com.example.apgov.dto.CitizenStatsDto;
import com.example.apgov.dto.CreateGrievanceRequest;
import com.example.apgov.entity.Users;
import java.util.List;

public interface CitizenService {
    CitizenStatsDto getStats(Users user);
    List<CitizenGrievanceDto> getMyGrievances(Users user);
    CitizenGrievanceDto getGrievanceById(String grievanceId, Users user);
    CitizenGrievanceDto createGrievance(CreateGrievanceRequest request, Users user);
    CitizenGrievanceDto withdrawGrievance(String grievanceId, Users user);
    void bookAppointment(AppointmentRequest request, Users user);
}
