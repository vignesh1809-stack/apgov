package com.example.apgov.service;

import com.example.apgov.dto.VillageOptionDto;
import com.example.apgov.entity.Users;
import java.util.List;

public interface CommonService {
    List<VillageOptionDto> getVillages(Users user);
    List<String> getCategories();
}
