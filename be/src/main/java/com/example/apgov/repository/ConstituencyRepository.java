package com.example.apgov.repository;

import com.example.apgov.entity.Constituencies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConstituencyRepository extends JpaRepository<Constituencies, String> {
    Optional<Constituencies> findByNameIgnoreCase(String name);
}
