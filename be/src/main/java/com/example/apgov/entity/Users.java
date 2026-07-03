package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    @Id
    @Column(length = 36)
    private String id; // Matches VARCHAR(36) in schema.sql

    @Column(name = "employee_id", length = 50, unique = true)
    private String employeeId;

    @Column(name = "sso_uid", length = 255, nullable = false, unique = true)
    private String ssoUid;

    @Column(name = "first_name", length = 100, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(length = 20, nullable = false, unique = true)
    private String phone;

    @Column(length = 30, nullable = false)
    private String role; // 'citizen', 'fieldofficer', 'mla', 'coordinator'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "constituency_id", foreignKey = @ForeignKey(name = "fk_user_constituency"))
    private Constituencies constituency;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
