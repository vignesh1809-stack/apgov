package com.example.apgov.repository;

import com.example.apgov.entity.GrievanceTimelines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GrievanceTimelineRepository extends JpaRepository<GrievanceTimelines, String> {
    List<GrievanceTimelines> findByGrievanceIdOrderByTimestampAsc(String grievanceId);
}
