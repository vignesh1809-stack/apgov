package com.example.apgov.repository;

import com.example.apgov.entity.FieldOfficerProfiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FieldOfficerProfileRepository extends JpaRepository<FieldOfficerProfiles, String> {
    Optional<FieldOfficerProfiles> findByUserId(String userId);
    List<FieldOfficerProfiles> findByAssignedConstituencyId(String assignedConstituencyId);
}
