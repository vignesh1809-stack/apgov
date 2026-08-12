package com.example.apgov.service.impl;

import com.example.apgov.dto.VillageOptionDto;
import com.example.apgov.entity.Users;
import com.example.apgov.entity.Villages;
import com.example.apgov.repository.ConstituencyRepository;
import com.example.apgov.repository.VillageRepository;
import com.example.apgov.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommonServiceImpl implements CommonService {

    private final VillageRepository villageRepository;
    private final ConstituencyRepository constituencyRepository;

    @Autowired
    public CommonServiceImpl(VillageRepository villageRepository, ConstituencyRepository constituencyRepository) {
        this.villageRepository = villageRepository;
        this.constituencyRepository = constituencyRepository;
    }

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "villagesList", key = "#user != null && #user.constituency != null ? #user.constituency.id : 'all'")
    @Transactional(readOnly = true)
    public List<VillageOptionDto> getVillages(Users user) {
        String constituencyId = user != null && user.getConstituency() != null ? user.getConstituency().getId() : null;
        List<Villages> villages;
        if (constituencyId != null) {
            villages = villageRepository.findByConstituencyId(constituencyId);
        } else {
            villages = villageRepository.findAll();
        }

        return villages.stream().map(v -> VillageOptionDto.builder()
                .id(v.getId())
                .name(v.getName())
                .mandalId(v.getMandal() != null ? v.getMandal().getId() : null)
                .mandalName(v.getMandal() != null ? v.getMandal().getName() : null)
                .constituencyId(v.getConstituency() != null ? v.getConstituency().getId() : null)
                .constituencyName(v.getConstituency() != null ? v.getConstituency().getName() : null)
                .build()).collect(Collectors.toList());
    }

    @Override
    @org.springframework.cache.annotation.Cacheable("categoriesList")
    public List<String> getCategories() {
        return Arrays.asList("Road", "Water", "Electricity", "Health", "Education", "Environment");
    }
}
