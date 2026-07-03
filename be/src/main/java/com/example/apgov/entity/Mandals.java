package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mandals", uniqueConstraints = {
    @UniqueConstraint(name = "uq_mandal_constituency", columnNames = {"id", "constituency_id"})
})
public class Mandals {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "constituency_id", nullable = false, insertable = false, updatable = false)
    private String constituencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "constituency_id", nullable = false, foreignKey = @ForeignKey(name = "fk_mandal_constituency"))
    private Constituencies constituency;

    @Column(nullable = false, length = 100)
    private String name;
}
