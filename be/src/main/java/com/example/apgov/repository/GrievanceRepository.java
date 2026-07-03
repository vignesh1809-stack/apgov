package com.example.apgov.repository;

import com.example.apgov.entity.Grievances;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievances, String> {

    @Query(value = "SELECT " +
            "COUNT(*) AS total, " +
            "COALESCE(SUM(status = 'Resolved'), 0) AS resolved, " +
            "COALESCE(SUM(status = 'Pending'), 0) AS pending, " +
            "COALESCE(SUM(status = 'Visited'), 0) AS visited, " +
            "COALESCE(SUM(status = 'Acknowledged'), 0) AS acknowledged, " +
            "COALESCE(SUM(status = 'EnRoute'), 0) AS enroute, " +
            "COALESCE(ROUND(SUM(status = 'Resolved') * 100.0 / NULLIF(COUNT(*), 0), 2), 0.0) AS resolutionRate, " +
            "COALESCE(ROUND(AVG(CASE WHEN status = 'Resolved' THEN TIMESTAMPDIFF(DAY, created_at, updated_at) END), 2), 0.0) AS avgResolutionDays " +
            "FROM grievances " +
            "WHERE constituency_id = :constituencyId", nativeQuery = true)
    MlaKpiProjection getMlaKpis(@Param("constituencyId") String constituencyId);

    @Query(value = "SELECT category, COUNT(*) AS count " +
            "FROM grievances " +
            "WHERE constituency_id = :constituencyId " +
            "GROUP BY category", nativeQuery = true)
    List<MlaCategoryKpiProjection> getMlaCategoryKpis(@Param("constituencyId") String constituencyId);

    @Query(value = "SELECT v.name AS villageName, COUNT(*) AS totalIssues, " +
            "COALESCE(SUM(g.status = 'Resolved'), 0) AS resolvedIssues, " +
            "COALESCE(ROUND(SUM(g.status = 'Resolved') * 100.0 / COUNT(*), 2), 0.0) AS resolutionRate " +
            "FROM grievances g " +
            "JOIN villages v ON g.village_id = v.id " +
            "WHERE v.constituency_id = :constituencyId " +
            "GROUP BY v.id, v.name " +
            "ORDER BY resolutionRate DESC", nativeQuery = true)
    List<MlaVillagePerformanceProjection> getMlaVillagePerformance(@Param("constituencyId") String constituencyId);

    @Query(value = "SELECT " +
            "m.id AS mandalId, " +
            "m.name AS mandalName, " +
            "COUNT(g.id) AS totalGrievances, " +
            "COALESCE(SUM(g.status = 'Resolved'), 0) AS resolvedGrievances, " +
            "COALESCE(SUM(g.status = 'Pending'), 0) AS pendingGrievances, " +
            "COALESCE(SUM(g.status IN ('Acknowledged', 'EnRoute', 'Visited')), 0) AS inProgressGrievances, " +
            "COALESCE(ROUND(SUM(g.status = 'Resolved') * 100.0 / NULLIF(COUNT(g.id), 0), 2), 0.0) AS resolutionRate, " +
            "COALESCE(ROUND(AVG(CASE WHEN g.status = 'Resolved' THEN TIMESTAMPDIFF(DAY, g.created_at, g.updated_at) END), 1), 0.0) AS avgResolutionDays " +
            "FROM mandals m " +
            "LEFT JOIN villages v ON v.mandal_id = m.id AND v.constituency_id = m.constituency_id " +
            "LEFT JOIN grievances g ON g.village_id = v.id AND g.constituency_id = v.constituency_id " +
            "WHERE m.constituency_id = :constituencyId " +
            "GROUP BY m.id, m.name", nativeQuery = true)
    List<MlaMandalPerformanceProjection> getMlaMandalPerformance(@Param("constituencyId") String constituencyId);
}
