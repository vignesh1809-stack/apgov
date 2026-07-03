package com.example.apgov.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "constituencies")
public class Constituencies {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, columnDefinition = "MULTIPOLYGON")
    private MultiPolygon boundary; // Maps to MULTIPOLYGON SRID 4326

    // Helper method to set boundary from WKT (Well-Known Text)
    public void setBoundaryFromWkt(String wkt) {
        if (wkt == null || wkt.isBlank()) {
            this.boundary = null;
            return;
        }
        try {
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
            WKTReader reader = new WKTReader(geometryFactory);
            this.boundary = (MultiPolygon) reader.read(wkt);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid WKT format for MultiPolygon: " + e.getMessage(), e);
        }
    }
}
