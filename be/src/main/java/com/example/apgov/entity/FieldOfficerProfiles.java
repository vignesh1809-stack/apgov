package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "field_officer_profiles")
public class FieldOfficerProfiles {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_foprofile_user"))
    private Users user;

    @Column(length = 100)
    private String designation;

    @Column(name = "assigned_constituency_id", nullable = false, insertable = false, updatable = false)
    private String assignedConstituencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_constituency_id", nullable = false, foreignKey = @ForeignKey(name = "fk_foprofile_constituency"))
    private Constituencies assignedConstituency;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "active_zone_wards")
    private List<String> activeZoneWards; // Stores JSON array of active zone wards (e.g., ["Ward 1", "Ward 2"])
}
