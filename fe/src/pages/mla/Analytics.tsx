import React from 'react';
import { useAppSelector } from '../../store';
import { translations } from '../../i18n/translations';

const Analytics: React.FC = () => {
  const { list: issues } = useAppSelector((state) => state.issues);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  const getTranslatedVillageName = (name: string) => {
    if (name === 'Kuppam') return t.kuppam;
    if (name === 'Ramagiri') return t.ramagiri;
    if (name === 'Gudupalli') return t.gudupalli;
    if (name === 'Venkatapur') return t.venkatapur;
    if (name === 'Bethampudi') return t.bethampudi;
    return name;
  };

  // Dynamic calculations based on base numbers + issues list
  const baseTotal = 1243;
  const baseResolved = 875;

  const dynamicTotal = baseTotal + issues.length;
  const dynamicResolved = baseResolved + issues.filter((i) => i.status === 'Resolved').length;

  const resolutionRateVal = parseFloat(((dynamicResolved / dynamicTotal) * 100).toFixed(1));

  // Dynamic satisfaction score (starts at 4.2 stars, increases with resolution rate)
  const satisfactionVal = (4.2 + (resolutionRateVal - 70.2) * 0.04).toFixed(1);

  // Dynamic improvement percentage
  const improvementVal = Math.round(18 + (resolutionRateVal - 70.2) * 0.5);

  // Village stats (reused from Dashboard calculations to stay consistent)
  const villages = [
    { name: 'Kuppam', base: 311, rateBase: 0.93, color: '#4ade80' },
    { name: 'Ramagiri', base: 186, rateBase: 0.78, color: '#FFD700' },
    { name: 'Gudupalli', base: 142, rateBase: 0.61, color: '#FFD700' },
    { name: 'Venkatapur', base: 98, rateBase: 0.51, color: '#f87171' },
    { name: 'Bethampudi', base: 72, rateBase: 0.47, color: '#f87171' },
  ];

  const villageData = villages.map((v) => {
    const activeTotal = issues.filter((i) => i.village === v.name).length;
    const activeResolved = issues.filter((i) => i.village === v.name && i.status === 'Resolved').length;

    const total = v.base + activeTotal;
    const resolved = Math.round(v.base * v.rateBase) + activeResolved;
    const rate = Math.round((resolved / total) * 100);

    return {
      ...v,
      rate,
    };
  });

  return (
    <div id="page-analytics">
      <div className="section-label">{t.last30Days}</div>

      {/* SVG Trendline */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.monthlyTrend}</div>
        </div>
        <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="gRaised" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Filled Areas */}
          <path d="M0,80 L30,70 L60,60 L90,65 L120,45 L150,38 L180,28 L210,20 L240,14 L270,10 L300,6 L300,100 L0,100 Z" fill="url(#gRaised)" />
          <path d="M0,90 L30,84 L60,76 L90,80 L120,68 L150,62 L180,54 L210,48 L240,40 L270,34 L300,26 L300,100 L0,100 Z" fill="url(#gResolved)" />
          
          {/* Line paths */}
          <path d="M0,80 L30,70 L60,60 L90,65 L120,45 L150,38 L180,28 L210,20 L240,14 L270,10 L300,6" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinejoin="round" />
          <path d="M0,90 L30,84 L60,76 L90,80 L120,68 L150,62 L180,54 L210,48 L240,40 L270,34 L300,26" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="5,3" strokeLinejoin="round" />
        </svg>
        <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <div style={{ width: '16px', height: '2px', background: '#FFD700', borderRadius: '2px' }} />
            {t.issuesRaised}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <div style={{ width: '16px', height: '2px', background: '#4ade80', borderRadius: '2px', borderTop: '2px dashed #4ade80' }} />
            {t.resolved}
          </div>
        </div>
      </div>

      {/* Resolution Rate by Village */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.resolutionRate}</div>
        </div>
        {villageData.map((v) => (
          <div className="bar-row" key={v.name}>
            <div className="bar-lbl">{getTranslatedVillageName(v.name)}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${v.rate}%`, background: v.color }} />
            </div>
            <div className="bar-pct">{v.rate}%</div>
          </div>
        ))}
      </div>

      {/* Analytics KPIs */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: '#fffde7' }}>
              <i className="ti ti-star" style={{ color: 'var(--gold-dark)' }} aria-hidden="true" />
            </div>
          </div>
          <div className="kpi-num" style={{ color: 'var(--gold-dark)' }}>{satisfactionVal}★</div>
          <div className="kpi-lbl">{t.citizenSatisfaction}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="ti ti-trending-up" style={{ color: 'var(--green)' }} aria-hidden="true" />
            </div>
          </div>
          <div className="kpi-num" style={{ color: 'var(--green)' }}>{improvementVal >= 0 ? `+${improvementVal}` : `${improvementVal}`}%</div>
          <div className="kpi-lbl">{t.rateImprovement}</div>
        </div>
      </div>
      <div style={{ height: '8px' }} />
    </div>
  );
};

export default Analytics;
