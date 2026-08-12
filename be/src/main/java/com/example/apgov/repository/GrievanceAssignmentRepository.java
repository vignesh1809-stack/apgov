package com.example.apgov.repository;

import com.example.apgov.entity.GrievanceAssignments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceAssignmentRepository extends JpaRepository<GrievanceAssignments, String> {
    Optional<GrievanceAssignments> findByGrievanceId(String grievanceId);
    List<GrievanceAssignments> findByFieldOfficerIdOrderByStopSequenceAsc(String fieldOfficerId);
    List<GrievanceAssignments> findByFieldOfficerIdAndStatus(String fieldOfficerId, String status);

    @Query("SELECT COUNT(ga) FROM GrievanceAssignments ga WHERE ga.fieldOfficerId = :fieldOfficerId AND ga.status IN ('Pending', 'EnRoute', 'Visited')")
    long countActiveTasksByFieldOfficerId(@Param("fieldOfficerId") String fieldOfficerId);

    @Query("SELECT COUNT(ga) FROM GrievanceAssignments ga WHERE ga.fieldOfficerId = :fieldOfficerId AND ga.status = 'Resolved'")
    long countResolvedTasksByFieldOfficerId(@Param("fieldOfficerId") String fieldOfficerId);
}
