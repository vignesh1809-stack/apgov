package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceAssignments {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    // Maps the composite foreign key (grievance_id, constituency_id) referencing grievances(id, constituency_id)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumns(value = {
        @JoinColumn(name = "grievance_id", referencedColumnName = "id", nullable = false),
        @JoinColumn(name = "constituency_id", referencedColumnName = "constituency_id", nullable = false)
    }, foreignKey = @ForeignKey(name = "fk_assignment_grievance"))
    private Grievances grievance;

    @Column(name = "field_officer_id", nullable = false)
    private String fieldOfficerId;

    // Maps the composite foreign key (field_officer_id, constituency_id) referencing field_officer_profiles(id, assigned_constituency_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns(value = {
        @JoinColumn(name = "field_officer_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false),
        @JoinColumn(name = "constituency_id", referencedColumnName = "assigned_constituency_id", nullable = false, insertable = false, updatable = false)
    }, foreignKey = @ForeignKey(name = "fk_assignment_officer"))
    private FieldOfficerProfiles fieldOfficer;

    @Column(name = "stop_sequence", nullable = false)
    private Integer stopSequence;

    @Column(name = "assignment_date", nullable = false)
    private LocalDate assignmentDate;

    @Column(nullable = false, length = 30)
    private String status; // 'Pending', 'EnRoute', 'Visited', 'Resolved'

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "field_notes", columnDefinition = "TEXT")
    private String fieldNotes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
