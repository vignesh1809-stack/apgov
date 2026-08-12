package com.example.apgov.repository;

import com.example.apgov.entity.Villages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VillageRepository extends JpaRepository<Villages, String> {
    List<Villages> findByConstituencyId(String constituencyId);
    List<Villages> findByMandalId(String mandalId);
    Optional<Villages> findByNameIgnoreCaseAndConstituencyId(String name, String constituencyId);
}
