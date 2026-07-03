package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_timelines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceTimelines {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false, foreignKey = @ForeignKey(name = "fk_timeline_grievance"))
    private Grievances grievance;

    @Column(name = "action_status", nullable = false, length = 30)
    private String actionStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_timeline_actor"))
    private Users actor;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(insertable = false, updatable = false)
    private LocalDateTime timestamp;
}
