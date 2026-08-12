package com.example.apgov.repository;

import com.example.apgov.entity.Mandals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MandalRepository extends JpaRepository<Mandals, String> {
    List<Mandals> findByConstituencyId(String constituencyId);
}
