import React from 'react';
import type { Assignment } from '../types';
import FOPageHeader from '../components/FOPageHeader';
import FORouteStopItem from '../components/FORouteStopItem';

interface FORouteMapProps {
  assignments: Assignment[];
  totalAssigned: number;
  onScreenChange: (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => void;
  t: any;
  language: string;
}

const getTranslatedVillageName = (name: string, t: any) => {
  if (name === 'Kuppam') return t.kuppam;
  if (name === 'Ramagiri') return t.ramagiri;
  if (name === 'Gudupalli') return t.gudupalli;
  if (name === 'Venkatapur') return t.venkatapur;
  if (name === 'Bethampudi') return t.bethampudi;
  return name;
};

const getStopCoord = (stopNum: number) => {
  const coords: { [key: number]: { x: number; y: number } } = {
    1: { x: 75, y: 95 },     // Kuppam Town
    2: { x: 80, y: 110 },    // Kuppam Town
    3: { x: 70, y: 125 },    // Kuppam Town
    4: { x: 75, y: 175 },    // Venkatapur
    5: { x: 165, y: 75 },    // Ramagiri
    6: { x: 140, y: 180 },   // Bethampudi
    7: { x: 95, y: 95 },     // Kuppam Town
    8: { x: 210, y: 130 },   // Gudupalli / Nattrampallee
  };
  return coords[stopNum] || { x: 150, y: 110 };
};

const FORouteMap: React.FC<FORouteMapProps> = ({
  assignments,
  totalAssigned,
  onScreenChange,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const villageStats = [
    {
      name: 'Kuppam',
      path: 'M 30,80 L 110,50 L 135,110 L 95,150 L 40,130 Z',
      color: '#e2f9ec', // light green
      labelX: 70,
      labelY: 95,
    },
    {
      name: 'Ramagiri',
      path: 'M 110,50 L 200,30 L 230,100 L 135,110 Z',
      color: '#fffde7', // light gold/yellow
      labelX: 155,
      labelY: 75,
    },
    {
      name: 'Gudupalli',
      path: 'M 135,110 L 230,100 L 260,160 L 170,170 Z',
      color: '#fffde7', // light gold/yellow
      labelX: 190,
      labelY: 135,
    },
    {
      name: 'Venkatapur',
      path: 'M 40,130 L 95,150 L 115,200 L 30,190 Z',
      color: '#fdf2f2', // light red
      labelX: 65,
      labelY: 165,
    },
    {
      name: 'Bethampudi',
      path: 'M 95,150 L 170,170 L 175,210 L 115,200 Z',
      color: '#fdf2f2', // light red
      labelX: 130,
      labelY: 180,
    },
  ];

  return (
    <div className="screen on" id="s-map">
      <FOPageHeader
        title={`${t.todaysRoute} ${isTelugu ? 'మ్యాప్' : 'Map'}`}
        subTitle={isTelugu ? 'సమస్యల పరిష్కార మార్గ ఆప్టిమైజేషన్' : 'Sequential stop locations optimization'}
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
        variant="page"
      />

      <div style={{ paddingBottom: '20px' }}>
        <div className="map-area d1" style={{ height: '280px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', position: 'relative', margin: '8px 14px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 220"
            style={{ display: 'block' }}
          >
            {villageStats.map((v) => {
              return (
                <g key={v.name}>
                  <path
                    d={v.path}
                    className="village-path"
                    style={{ fill: v.color }}
                  />
                  <text
                    x={v.labelX}
                    y={v.labelY}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="9"
                    fontWeight="700"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {getTranslatedVillageName(v.name, t)}
                  </text>
                </g>
              );
            })}

            {/* SVG Route Pins */}
            {assignments.map((stop) => {
              const coord = getStopCoord(stop.stopNum);
              
              let pinColor = '#888';
              if (stop.status === 'Resolved') {
                pinColor = 'var(--green)';
              } else if (stop.status === 'En route') {
                pinColor = '#ea580c';
              } else if (stop.urgency === 'High') {
                pinColor = 'var(--red)';
              }

              return (
                <g
                  key={stop.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onScreenChange('detail', stop.id)}
                >
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="10"
                    fill="#fff"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="8.5"
                    fill={pinColor}
                  />
                  <text
                    x={coord.x}
                    y={coord.y + 3.5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="9"
                    fontWeight="800"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {stop.stopNum}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="map-lbl"><i className="ti ti-map-pin" aria-hidden="true"></i>Kuppam Constituency · {totalAssigned} {t.stops}</div>
          
          <div style={{ position: 'absolute', top: '10px', right: '12px', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', padding: '7px 10px', display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#555', fontWeight: '700' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></div>{isTelugu ? 'పూర్తయింది' : 'Done'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#555', fontWeight: '700' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }}></div>{t.active}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#555', fontWeight: '700' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }}></div>{isTelugu ? 'అత్యవసరం' : 'Urgent'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#555', fontWeight: '700' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#888' }}></div>{t.pendingStatus}</div>
          </div>
        </div>

        <div className="sec-hdr d2">
          <div className="sec-left">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{isTelugu ? 'అన్ని రూట్ స్టాప్‌లు' : 'All route stops'}</div>
          </div>
          <span className="sec-cnt">{totalAssigned} {t.stops}</span>
        </div>

        <div className="glass d2" style={{ margin: '0 14px 8px', borderRadius: '16px', padding: '13px 14px' }}>
          {assignments.map((stop, idx) => (
            <React.Fragment key={stop.id}>
              <FORouteStopItem
                stop={stop}
                language={language}
                onClick={() => onScreenChange('detail', stop.id)}
                rightElement={
                  <span className={stop.urgency === 'High' ? 'ppill h' : stop.urgency === 'Medium' ? 'ppill m' : 'ppill l'}>
                    {stop.urgency === 'High' ? t.highLabel : stop.urgency === 'Medium' ? t.mediumLabel : t.lowLabel}
                  </span>
                }
              />
              {idx < assignments.length - 1 && (
                <div style={{ width: '2px', height: '12px', background: '#f0f0f0', margin: '2px 11px' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FORouteMap;
