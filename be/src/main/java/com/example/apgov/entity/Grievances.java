package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grievances")
public class Grievances {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "reference_code", nullable = false, unique = true, length = 50)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false, foreignKey = @ForeignKey(name = "fk_grievance_citizen"))
    private Users citizen;

    @Column(nullable = false, length = 50)
    private String category; // 'Road', 'Water', 'Electricity', 'Health', 'Education', 'Environment'

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "constituency_id", nullable = false, insertable = false, updatable = false)
    private String constituencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "constituency_id", nullable = false, foreignKey = @ForeignKey(name = "fk_grievance_constituency"))
    private Constituencies constituency;

    @Column(name = "village_id", nullable = false)
    private String villageId;

    // Maps the composite foreign key (village_id, constituency_id) referencing villages(id, constituency_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns(value = {
        @JoinColumn(name = "village_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false),
        @JoinColumn(name = "constituency_id", referencedColumnName = "constituency_id", nullable = false, insertable = false, updatable = false)
    }, foreignKey = @ForeignKey(name = "fk_grievance_village"))
    private Villages village;

    @Column(nullable = false, length = 10)
    private String urgency; // 'Low', 'Medium', 'High'

    @Column(nullable = false, length = 30)
    private String status; // 'Pending', 'Acknowledged', 'EnRoute', 'Visited', 'Resolved', 'Escalated', 'Withdrawn'

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
