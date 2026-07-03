package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceAttachments {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false, foreignKey = @ForeignKey(name = "fk_attachment_grievance"))
    private Grievances grievance;

    @Column(name = "uploader_role", nullable = false, length = 20)
    private String uploaderRole; // 'citizen', 'fieldofficer'

    @Column(name = "storage_url", nullable = false, length = 1024)
    private String storageUrl;

    @Column(name = "uploaded_at", insertable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
