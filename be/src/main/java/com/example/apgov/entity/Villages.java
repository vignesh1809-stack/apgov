package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "villages")
public class Villages {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "constituency_id", nullable = false, insertable = false, updatable = false)
    private String constituencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "constituency_id", nullable = false, foreignKey = @ForeignKey(name = "fk_village_constituency"))
    private Constituencies constituency;

    @Column(name = "mandal_id", nullable = false)
    private String mandalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns(value = {
        @JoinColumn(name = "mandal_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false),
        @JoinColumn(name = "constituency_id", referencedColumnName = "constituency_id", nullable = false, insertable = false, updatable = false)
    }, foreignKey = @ForeignKey(name = "fk_village_mandal"))
    private Mandals mandal;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "POLYGON")
    private Polygon boundary; // Maps to POLYGON SRID 4326

    // Helper method to set boundary from WKT (Well-Known Text)
    public void setBoundaryFromWkt(String wkt) {
        if (wkt == null || wkt.isBlank()) {
            this.boundary = null;
            return;
        }
        try {
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
            WKTReader reader = new WKTReader(geometryFactory);
            this.boundary = (Polygon) reader.read(wkt);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid WKT format for Polygon: " + e.getMessage(), e);
        }
    }
}
