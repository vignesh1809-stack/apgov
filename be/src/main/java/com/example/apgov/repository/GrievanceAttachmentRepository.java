package com.example.apgov.repository;

import com.example.apgov.entity.GrievanceAttachments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GrievanceAttachmentRepository extends JpaRepository<GrievanceAttachments, String> {
    List<GrievanceAttachments> findByGrievanceId(String grievanceId);
}
