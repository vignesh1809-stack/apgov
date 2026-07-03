import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { translations } from '../../i18n/translations';
import { 
  fetchMlaKpis, 
  fetchMlaCategoryKpis, 
  fetchMlaVillagePerformance,
  fetchMlaMandalPerformance,
  selectMlaKpis, 
  selectMlaCategoryKpis, 
  selectMlaVillagePerformance,
  selectMlaLoading, 
  selectMlaError 
} from '../../store/mla';

const MlaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const kpis = useAppSelector(selectMlaKpis);
  const categoryKpis = useAppSelector(selectMlaCategoryKpis);
  const villagePerformance = useAppSelector(selectMlaVillagePerformance);
  const loading = useAppSelector(selectMlaLoading);
  const error = useAppSelector(selectMlaError);
  const { list: issues } = useAppSelector((state) => state.issues);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  useEffect(() => {
    dispatch(fetchMlaKpis());
    dispatch(fetchMlaCategoryKpis());
    dispatch(fetchMlaVillagePerformance());
    dispatch(fetchMlaMandalPerformance());
  }, [dispatch]);

  // Dynamic calculations based on base numbers + issues list
  const baseTotal = 1243;
  const baseResolved = 750;
  const basePending = 100;
  const baseVisited = 150;
  const baseAcknowledged = 180;
  const baseEnRoute = 63;

  const dynamicTotal = baseTotal + issues.length;
  const dynamicResolved = baseResolved + issues.filter((i) => i.status === 'Resolved').length;
  const dynamicPending = basePending + issues.filter((i) => i.status === 'Pending').length;
  const dynamicVisited = baseVisited + issues.filter((i) => (i.status as string) === 'Visited').length;
  const dynamicAcknowledged = baseAcknowledged + issues.filter((i) => (i.status as string) === 'Acknowledged').length;
  const dynamicEnRoute = baseEnRoute + issues.filter((i) => (i.status as string) === 'EnRoute' || (i.status as string) === 'En route').length;

  const resolutionRate = ((dynamicResolved / dynamicTotal) * 100).toFixed(1);

  // Category counts
  const categories = [
    { name: 'Road / Infra', base: 317, color: '#FFD700', backendKey: 'Road' },
    { name: 'Water supply', base: 243, color: '#60a5fa', backendKey: 'Water' },
    { name: 'Electricity', base: 177, color: '#facc15', backendKey: 'Electricity' },
    { name: 'Health', base: 123, color: '#f87171', backendKey: 'Health' },
    { name: 'Education', base: 88, color: '#4ade80', backendKey: 'Education' },
    { name: 'Personal', base: 62, color: '#c084fc', backendKey: 'Environment' },
  ];

  const categoryData = categories.map((c) => {
    let activeCount = 0;
    if (categoryKpis) {
      const match = categoryKpis.find((k) => k.category.toLowerCase() === c.backendKey.toLowerCase());
      activeCount = match ? match.count : 0;
    } else {
      activeCount = issues.filter((i) => i.category === c.name).length;
    }

    let label = c.name;
    if (c.name === 'Road / Infra') label = t.roadInfra;
    else if (c.name === 'Water supply') label = t.waterSupply;
    else if (c.name === 'Electricity') label = t.electricity;
    else if (c.name === 'Health') label = t.health;
    else if (c.name === 'Education') label = t.education;
    else if (c.name === 'Personal') label = t.personal;

    return {
      name: c.name,
      label,
      count: categoryKpis ? activeCount : (c.base + activeCount),
      color: c.color,
    };
  });

  const maxCategoryCount = Math.max(...categoryData.map((c) => c.count));

  // Donut SVG parameters
  const r = 42;
  const circ = 2 * Math.PI * r; // ~263.89

  const statusResolved = kpis ? kpis.resolved : dynamicResolved;
  const statusPending = kpis ? kpis.pending : dynamicPending;
  const statusVisited = kpis ? kpis.visited : dynamicVisited;
  const statusAcknowledged = kpis ? kpis.acknowledged : dynamicAcknowledged;
  const statusEnRoute = kpis ? kpis.enroute : dynamicEnRoute;

  const totalDistribution = statusResolved + statusPending + statusVisited + statusAcknowledged + statusEnRoute;

  const resolvedPct = totalDistribution > 0 ? statusResolved / totalDistribution : 0;
  const pendingPct = totalDistribution > 0 ? statusPending / totalDistribution : 0;
  const visitedPct = totalDistribution > 0 ? statusVisited / totalDistribution : 0;
  const acknowledgedPct = totalDistribution > 0 ? statusAcknowledged / totalDistribution : 0;
  const enRoutePct = totalDistribution > 0 ? statusEnRoute / totalDistribution : 0;

  const rStroke = resolvedPct * circ;
  const pStroke = pendingPct * circ;
  const vStroke = visitedPct * circ;
  const aStroke = acknowledgedPct * circ;
  const eStroke = enRoutePct * circ;

  // Village stats
  const villages = [
    { name: 'Kuppam', base: 311, rateBase: 0.93, color: '#f0fdf4', textColor: '#166534', rank: 1 },
    { name: 'Ramagiri', base: 186, rateBase: 0.78, color: '#fffde7', textColor: '#996600', rank: 2 },
    { name: 'Gudupalli', base: 142, rateBase: 0.61, color: '#fffde7', textColor: '#996600', rank: 3 },
    { name: 'Venkatapur', base: 98, rateBase: 0.51, color: '#fef2f2', textColor: '#991b1b', rank: 4 },
    { name: 'Bethampudi', base: 72, rateBase: 0.47, color: '#fef2f2', textColor: '#991b1b', rank: 5 },
  ];

  const getVillageColorPills = (rate: number) => {
    if (rate >= 80) {
      return { color: '#f0fdf4', textColor: '#166534' };
    } else if (rate >= 50) {
      return { color: '#fffde7', textColor: '#996600' };
    } else {
      return { color: '#fef2f2', textColor: '#991b1b' };
    }
  };

  const getVillageLabel = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('kuppam')) return t.kuppam;
    if (nameLower.includes('ramagiri')) return t.ramagiri;
    if (nameLower.includes('gudupalli')) return t.gudupalli;
    if (nameLower.includes('venkatapur')) return t.venkatapur;
    if (nameLower.includes('bethampudi')) return t.bethampudi;
    return name;
  };

  const villageData = villagePerformance && villagePerformance.length > 0
    ? villagePerformance.map((vp, index) => {
        const rate = Math.round(vp.resolutionRate);
        const { color, textColor } = getVillageColorPills(rate);
        return {
          name: vp.villageName,
          label: getVillageLabel(vp.villageName),
          total: vp.totalIssues,
          rate,
          rank: index + 1,
          color,
          textColor
        };
      })
    : villages.map((v) => {
        const activeTotal = issues.filter((i) => i.village === v.name).length;
        const activeResolved = issues.filter((i) => i.village === v.name && i.status === 'Resolved').length;

        const total = v.base + activeTotal;
        const resolved = Math.round(v.base * v.rateBase) + activeResolved;
        const rate = Math.round((resolved / total) * 100);

        return {
          ...v,
          label: getVillageLabel(v.name),
          total,
          rate,
        };
      });

  // Resolution Funnel counts
  const funnelSteps = [
    { name: 'Raised', label: t.raisedFunnel, count: dynamicTotal, bg: '#dbeafe', color: '#1e40af' },
    { name: 'Acknowledged', label: t.acknowledgedFunnel, count: Math.round(1061 + (dynamicTotal - 1248) * 0.85), bg: '#fffde7', color: '#854d0e' },
    { name: 'In progress', label: t.inProgressFunnel, count: Math.round(849 + (dynamicTotal - 1248) * 0.75), bg: '#fae8ff', color: '#701a75' },
    { name: 'Resolved', label: t.resolved, count: dynamicResolved, bg: '#dcfce7', color: '#14532d' },
    { name: 'Withdrawn', label: t.withdrawnFunnel, count: Math.round(224 + (dynamicTotal - 1248) * 0.12), bg: '#f3f4f6', color: '#6b7280' },
  ];

  const displayTotal = loading ? '...' : (kpis ? kpis.total.toLocaleString() : dynamicTotal.toLocaleString());
  const displayResolved = loading ? '...' : (kpis ? kpis.resolved.toLocaleString() : dynamicResolved.toLocaleString());
  const displayRate = loading ? '...' : (kpis ? kpis.resolutionRate.toFixed(2) + '%' : resolutionRate + '%');
  const displayCloseTime = loading ? '...' : (kpis ? kpis.avgResolutionDays.toFixed(2) + 'd' : '4.2d');
  const displayPending = loading ? '...' : (kpis ? (kpis.total - kpis.resolved).toLocaleString() : dynamicPending.toLocaleString());

  return (
    <div id="page-dashboard">
      <div className="section-label">{t.liveOverview}</div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '10px 14px',
          borderRadius: '16px',
          fontSize: '11px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <i className="ti ti-alert-circle" style={{ fontSize: '14px' }}></i>
          <span>{error} (Showing offline demo data)</span>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: '#fffde7' }}>
              <i className="ti ti-clipboard-list" style={{ color: 'var(--gold-dark)' }} aria-hidden="true"></i>
            </div>
            <span className="kpi-badge" style={{ background: '#fff8e1', color: 'var(--gold-deep)' }}>{t.total}</span>
          </div>
          <div className="kpi-num">{displayTotal}</div>
          <div className="kpi-lbl">{t.issuesRaised}</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="ti ti-circle-check" style={{ color: 'var(--green)' }} aria-hidden="true"></i>
            </div>
            <span className="kpi-badge" style={{ background: 'var(--green-bg)', color: 'var(--green-text)' }}>
              ↑ {loading ? '...' : (kpis ? 'Live' : (12 + issues.filter(i => i.status === 'Resolved').length))} {t.todaySuffix}
            </span>
          </div>
          <div className="kpi-num" style={{ color: 'var(--green)' }}>{displayResolved}</div>
          <div className="kpi-lbl">{t.resolved}</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: '#fffde7' }}>
              <i className="ti ti-chart-pie" style={{ color: 'var(--gold-dark)' }} aria-hidden="true"></i>
            </div>
            <span className="kpi-badge" style={{ background: '#fffde7', color: 'var(--gold-deep)' }}>{loading ? '...' : (kpis ? 'Live' : '↑ 3.1%')}</span>
          </div>
          <div className="kpi-num" style={{ color: 'var(--gold-dark)' }}>{displayRate}</div>
          <div className="kpi-lbl">{t.resolutionRate}</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon" style={{ background: 'var(--red-bg)' }}>
              <i className="ti ti-clock-hour-4" style={{ color: 'var(--red)' }} aria-hidden="true"></i>
            </div>
            <span className="kpi-badge" style={{ background: 'var(--red-bg)', color: 'var(--red-text)' }}>
              {displayPending} {t.leftSuffix}
            </span>
          </div>
          <div className="kpi-num" style={{ color: 'var(--red)' }}>{displayCloseTime}</div>
          <div className="kpi-lbl">{t.avgCloseTime}</div>
        </div>
      </div>

      {/* Category Bars */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.issuesByCategory}</div>
          <span className="see-all" onClick={() => navigate('/issues')}>{t.seeAll}</span>
        </div>
        {categoryData.map((c) => {
          const widthPct = maxCategoryCount > 0 ? (c.count / maxCategoryCount) * 100 : 0;
          return (
            <div className="bar-row" key={c.name}>
              <div className="bar-lbl">{c.label}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${widthPct}%`, background: c.color }} />
              </div>
              <div className="bar-pct">{c.count}</div>
            </div>
          );
        })}
      </div>

      {/* Donut Chart */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.statusDistribution}</div>
        </div>
        <div className="donut-row">
          <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="54" cy="54" r={r} fill="none" stroke="#f0f0f0" strokeWidth="16" />

            {/* Resolved Circle Segment */}
            {rStroke > 0 && (
              <circle
                cx="54"
                cy="54"
                r={r}
                fill="none"
                stroke="#4ade80"
                strokeWidth="16"
                strokeDasharray={`${rStroke} ${circ - rStroke}`}
                strokeDashoffset={0}
              />
            )}

            {/* Pending Circle Segment */}
            {pStroke > 0 && (
              <circle
                cx="54"
                cy="54"
                r={r}
                fill="none"
                stroke="#f87171"
                strokeWidth="16"
                strokeDasharray={`${pStroke} ${circ - pStroke}`}
                strokeDashoffset={-rStroke}
              />
            )}

            {/* Visited Circle Segment */}
            {vStroke > 0 && (
              <circle
                cx="54"
                cy="54"
                r={r}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="16"
                strokeDasharray={`${vStroke} ${circ - vStroke}`}
                strokeDashoffset={-(rStroke + pStroke)}
              />
            )}

            {/* Acknowledged Circle Segment */}
            {aStroke > 0 && (
              <circle
                cx="54"
                cy="54"
                r={r}
                fill="none"
                stroke="#facc15"
                strokeWidth="16"
                strokeDasharray={`${aStroke} ${circ - aStroke}`}
                strokeDashoffset={-(rStroke + pStroke + vStroke)}
              />
            )}

            {/* EnRoute Circle Segment */}
            {eStroke > 0 && (
              <circle
                cx="54"
                cy="54"
                r={r}
                fill="none"
                stroke="#c084fc"
                strokeWidth="16"
                strokeDasharray={`${eStroke} ${circ - eStroke}`}
                strokeDashoffset={-(rStroke + pStroke + vStroke + aStroke)}
              />
            )}
          </svg>

          {/* Centered Text overlay (outside rotated SVG to keep text upright) */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{displayRate}</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolved}</span>
          </div>

          <div className="legend-col" style={{ marginLeft: '12px' }}>
            <div className="leg-item">
              <div className="leg-dot" style={{ background: '#4ade80' }} />
              {t.resolved}
              <span className="leg-val">{statusResolved}</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot" style={{ background: '#f87171' }} />
              {t.pending}
              <span className="leg-val">{statusPending}</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot" style={{ background: '#60a5fa' }} />
              {language === 'te' ? 'సందర్శించినవి' : 'Visited'}
              <span className="leg-val">{statusVisited}</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot" style={{ background: '#facc15' }} />
              {t.acknowledgedFunnel}
              <span className="leg-val">{statusAcknowledged}</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot" style={{ background: '#c084fc' }} />
              {language === 'te' ? 'ప్రయాణంలో ఉన్నవి' : 'En Route'}
              <span className="leg-val">{statusEnRoute}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Village Performance */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.villagePerformance}</div>
          <span className="see-all" onClick={() => navigate('/villages')}>
            {language === 'te' ? 'అన్నీ చూడండి' : 'View all'}
          </span>
        </div>
        <div className="village-list">
          {villageData.slice(0, 5).map((v) => (
            <div className="vrow" key={v.name}>
              <div
                className="vrank"
                style={
                  v.rank > 3 ? { background: '#fecaca', color: '#991b1b' } : {}
                }
              >
                {v.rank}
              </div>
              <div className="vname">{v.label}</div>
              <div className="vcount">{v.total} {t.issuesCountSuffix}</div>
              <span className="vpill" style={{ background: v.color, color: v.textColor }}>
                {v.rate}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Funnel */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{t.resolutionFunnel}</div>
        </div>
        <div className="funnel-wrap">
          {funnelSteps.map((step) => {
            const widthPct = (step.count / dynamicTotal) * 100;
            return (
              <div className="fstep" key={step.name}>
                <div className="flbl">{step.label}</div>
                <div className="ftrack">
                  <div
                    className="fbar"
                    style={{
                      width: `${widthPct}%`,
                      background: step.bg,
                      color: step.color,
                    }}
                  >
                    {step.count.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: '8px' }} />
    </div>
  );
};

export default MlaDashboard;
