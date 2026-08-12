package com.example.apgov.controller;

import com.example.apgov.dto.VillageOptionDto;
import com.example.apgov.entity.Users;
import com.example.apgov.security.CustomUserDetails;
import com.example.apgov.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    private final CommonService commonService;

    @Autowired
    public CommonController(CommonService commonService) {
        this.commonService = commonService;
    }

    private Users getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping("/villages")
    public ResponseEntity<List<VillageOptionDto>> getVillages() {
        Users user = getAuthenticatedUser();
        List<VillageOptionDto> list = commonService.getVillages(user);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> list = commonService.getCategories();
        return ResponseEntity.ok(list);
    }
}
