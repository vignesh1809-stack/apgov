import React, { useState, useEffect } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { translations } from '../../i18n/translations';
import { fetchMlaMandalPerformance, selectMlaMandalPerformance, selectMlaLoading, selectMlaError } from '../../store/mla';

const MANDAL_COORDINATES_MAP: { [key: string]: any } = {
  // Shape 1 (Ramachandrapuram / Kuppam / Village 1)
  "ramachandrapuram": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.04, 16.88], [82.04, 16.85], [82.04, 16.83], [82.02, 16.83], [82.00, 16.87]]]
  },
  "kuppam": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.04, 16.88], [82.04, 16.85], [82.04, 16.83], [82.02, 16.83], [82.00, 16.87]]]
  },
  "village 1": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.04, 16.88], [82.04, 16.85], [82.04, 16.83], [82.02, 16.83], [82.00, 16.87]]]
  },

  // Shape 2 (Vemulavada / Ramagiri / Village 2)
  "vemulavada": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.02, 16.83], [82.00, 16.80], [81.99, 16.83], [82.00, 16.87]]]
  },
  "ramagiri": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.02, 16.83], [82.00, 16.80], [81.99, 16.83], [82.00, 16.87]]]
  },
  "village 2": {
    "type": "Polygon",
    "coordinates": [[[82.00, 16.87], [82.02, 16.83], [82.00, 16.80], [81.99, 16.83], [82.00, 16.87]]]
  },

  // Shape 3 (Someswaram / Gudupalli / Village 3)
  "someswaram": {
    "type": "Polygon",
    "coordinates": [[[82.02, 16.83], [82.04, 16.83], [82.04, 16.81], [82.04, 16.78], [82.00, 16.80], [82.02, 16.83]]]
  },
  "gudupalli": {
    "type": "Polygon",
    "coordinates": [[[82.02, 16.83], [82.04, 16.83], [82.04, 16.81], [82.04, 16.78], [82.00, 16.80], [82.02, 16.83]]]
  },
  "village 3": {
    "type": "Polygon",
    "coordinates": [[[82.02, 16.83], [82.04, 16.83], [82.04, 16.81], [82.04, 16.78], [82.00, 16.80], [82.02, 16.83]]]
  },

  // Shape 4 (Chelluru / Venkatapur / Village 4)
  "chelluru": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.88], [82.08, 16.86], [82.09, 16.83], [82.06, 16.83], [82.04, 16.83], [82.04, 16.85], [82.04, 16.88]]]
  },
  "venkatapur": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.88], [82.08, 16.86], [82.09, 16.83], [82.06, 16.83], [82.04, 16.83], [82.04, 16.85], [82.04, 16.88]]]
  },
  "village 4": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.88], [82.08, 16.86], [82.09, 16.83], [82.06, 16.83], [82.04, 16.83], [82.04, 16.85], [82.04, 16.88]]]
  },

  // Shape 5 (Draksharama / Bethampudi / Village 5)
  "draksharama": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.83], [82.06, 16.83], [82.09, 16.83], [82.08, 16.78], [82.04, 16.78], [82.04, 16.81], [82.04, 16.83]]]
  },
  "bethampudi": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.83], [82.06, 16.83], [82.09, 16.83], [82.08, 16.78], [82.04, 16.78], [82.04, 16.81], [82.04, 16.83]]]
  },
  "village 5": {
    "type": "Polygon",
    "coordinates": [[[82.04, 16.83], [82.06, 16.83], [82.09, 16.83], [82.08, 16.78], [82.04, 16.78], [82.04, 16.81], [82.04, 16.83]]]
  }
};

const Map: React.FC = () => {
  const navigate = useNav();
  const dispatch = useAppDispatch();
  const mandals = useAppSelector(selectMlaMandalPerformance);
  const loading = useAppSelector(selectMlaLoading);
  const error = useAppSelector(selectMlaError);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  const [hoveredMandalId, setHoveredMandalId] = useState<string | null>(null);
  const [selectedMandalId, setSelectedMandalId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMlaMandalPerformance());
  }, [dispatch]);

  const getTranslatedMandalName = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return (t as any)[key] || name;
  };

  if (loading && !mandals) {
    return (
      <div id="page-map" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '12px' }}>
        <div style={{ border: '3px solid #f3f3f3', borderTop: '3px solid var(--gold-dark)', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{(t as any).loading || 'Loading Map...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="page-map" style={{ padding: '24px', textAlign: 'center' }}>
        <i className="ti ti-alert-triangle" style={{ fontSize: '28px', color: 'var(--red)', marginBottom: '8px' }} />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  if (!mandals || mandals.length === 0) {
    return (
      <div id="page-map" style={{ padding: '24px', textAlign: 'center' }}>
        <i className="ti ti-map" style={{ fontSize: '28px', color: 'var(--text-muted)', marginBottom: '8px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No mandal maps found for your constituency.</p>
      </div>
    );
  }

  // Find min/max lat/long across all mandals to scale them to SVG viewBox (300x220)
  let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;

  mandals.forEach(m => {
    const normalizedKey = m.mandalName.toLowerCase().trim();
    let geom = (m as any).boundaryGeoJson || MANDAL_COORDINATES_MAP[normalizedKey];
    if (typeof geom === 'string') {
      try {
        geom = JSON.parse(geom);
      } catch (e) {
        geom = null;
      }
    }
    if (geom && geom.coordinates && geom.coordinates[0]) {
      geom.coordinates[0].forEach(([lon, lat]: [number, number]) => {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });
    }
  });

  const padding = 25;
  const svgWidth = 300;
  const svgHeight = 220;
  const plotWidth = svgWidth - 2 * padding;
  const plotHeight = svgHeight - 2 * padding;

  const lonRange = maxLon - minLon || 1;
  const latRange = maxLat - minLat || 1;

  const projectedMandals = mandals.map(m => {
    const normalizedKey = m.mandalName.toLowerCase().trim();
    let geom = (m as any).boundaryGeoJson || MANDAL_COORDINATES_MAP[normalizedKey];
    if (typeof geom === 'string') {
      try {
        geom = JSON.parse(geom);
      } catch (e) {
        geom = null;
      }
    }

    let path = '';
    let centerX = 0;
    let centerY = 0;

    if (geom && geom.coordinates && geom.coordinates[0]) {
      const points = geom.coordinates[0].map(([lon, lat]: [number, number]) => {
        const x = padding + ((lon - minLon) / lonRange) * plotWidth;
        const y = padding + (1 - (lat - minLat) / latRange) * plotHeight;
        return { x, y };
      });

      path = `M ${points.map((p: {x: number, y: number}) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z`;

      let sumX = 0, sumY = 0;
      points.forEach((p: {x: number, y: number}) => {
        sumX += p.x;
        sumY += p.y;
      });
      centerX = sumX / points.length;
      centerY = sumY / points.length;
    }

    return {
      id: m.mandalId,
      name: m.mandalName,
      path,
      centerX,
      centerY,
      metrics: m.metrics,
      status: m.status
    };
  }).filter(pm => pm.path !== '');

  const selectedMandal = projectedMandals.find(pm => pm.id === selectedMandalId);

  return (
    <div id="page-map">
      <div className="section-label">{t.interactiveMap}</div>

      <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {t.mapInstruction}
        </p>

        <div className="map-container">
          <svg
            width="100%"
            height="280"
            viewBox="0 0 300 220"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.06))' }}
          >
            {projectedMandals.map((m) => {
              const isSelected = selectedMandalId === m.id;
              const isHovered = hoveredMandalId === m.id;
              
              let fill = '#e2e8f0';
              if (isSelected) fill = 'var(--gold-dark)';
              else if (isHovered) fill = 'var(--gold)';
              else fill = m.status.colorCode === '#4ADE80' ? '#e2f9ec' : m.status.colorCode === '#FFD700' ? '#fffde7' : '#fdf2f2';

              return (
                <g key={m.id}>
                  <path
                    d={m.path}
                    className={`village-path ${isSelected ? 'active' : ''}`}
                    style={{ fill }}
                    onMouseEnter={() => setHoveredMandalId(m.id)}
                    onMouseLeave={() => setHoveredMandalId(null)}
                    onClick={() => setSelectedMandalId(isSelected ? null : m.id)}
                  />
                  
                  {/* Mandal Name Label */}
                  <text
                    x={m.centerX}
                    y={m.centerY - 2}
                    textAnchor="middle"
                    fill={isSelected ? '#fff' : 'var(--text-secondary)'}
                    fontSize="9"
                    fontWeight="700"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {getTranslatedMandalName(m.name)}
                  </text>
                  
                  {/* Resolution Rate Number */}
                  <text
                    x={m.centerX}
                    y={m.centerY + 10}
                    textAnchor="middle"
                    fill={
                      isSelected ? '#fff' :
                      m.status.colorCode === '#4ADE80' ? '#16a34a' :
                      m.status.colorCode === '#FFD700' ? '#b45309' :
                      '#dc2626'
                    }
                    fontSize="9"
                    fontWeight="800"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {Math.round(m.metrics.resolutionRate)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {selectedMandal ? (
        <div className="card" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <div className="card-head" style={{ marginBottom: '8px' }}>
            <div className="card-title" style={{ fontSize: '14px' }}>
              <i className="ti ti-map-pin" style={{ color: 'var(--gold-dark)', marginRight: '6px' }} />
              {getTranslatedMandalName(selectedMandal.name)} {t.statistics}
            </div>
            <span
              className="see-all"
              style={{ fontSize: '10px' }}
              onClick={() => setSelectedMandalId(null)}
            >
              {t.clear}
            </span>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '10px' }}>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.totalRaised}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedMandal.metrics.totalGrievances}
                </div>
              </div>
              <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '10px' }}>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolution}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--green)' }}>
                  {selectedMandal.metrics.resolutionRate}%
                </div>
              </div>
            </div>

            <button
              className="login-btn"
              style={{ width: '100%', padding: '10px', marginTop: '0', fontSize: '12px' }}
              onClick={() => {
                navigate(`/issues?village=${selectedMandal.name}`);
              }}
            >
              {t.viewIssuesIn || 'View Issues in'} {getTranslatedMandalName(selectedMandal.name)}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '18px 12px', textAlign: 'center', background: '#f8f9fa' }}>
          <i className="ti ti-info-circle" style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '6px' }} />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {t.mapHelpPrompt}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
