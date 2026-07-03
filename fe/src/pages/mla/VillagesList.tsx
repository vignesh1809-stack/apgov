import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { translations } from '../../i18n/translations';
import {
  fetchMlaVillagePerformance,
  selectMlaVillagePerformance,
  selectMlaLoading,
  selectMlaError
} from '../../store/mla';

const VillagesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const villagePerformance = useAppSelector(selectMlaVillagePerformance);
  const loading = useAppSelector(selectMlaLoading);
  const error = useAppSelector(selectMlaError);
  const { list: issues } = useAppSelector((state) => state.issues);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'highest' | 'lowest' | 'issues' | 'alphabetical'>('highest');
  const [filterOption, setFilterOption] = useState<'all' | 'good' | 'warning'>('all');
  const [expandedVillage, setExpandedVillage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMlaVillagePerformance());
  }, [dispatch]);

  // Fallback offline mock data (from Kuppam constituency)
  const fallbackVillages = useMemo(() => [
    { name: 'Kuppam', base: 311, rateBase: 0.93 },
    { name: 'Ramagiri', base: 186, rateBase: 0.78 },
    { name: 'Gudupalli', base: 142, rateBase: 0.61 },
    { name: 'Venkatapur', base: 98, rateBase: 0.51 },
    { name: 'Bethampudi', base: 72, rateBase: 0.47 },
  ], []);

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

  // Compile final village stats dynamically matching dashboard logic
  const compiledVillageData = useMemo(() => {
    let list = [];
    if (villagePerformance && villagePerformance.length > 0) {
      list = villagePerformance.map((vp) => {
        const rate = Math.round(vp.resolutionRate);
        const { color, textColor } = getVillageColorPills(rate);
        return {
          name: vp.villageName,
          label: getVillageLabel(vp.villageName),
          total: vp.totalIssues,
          resolved: vp.resolvedIssues,
          rate,
          color,
          textColor
        };
      });
    } else {
      list = fallbackVillages.map((v) => {
        const activeTotal = issues.filter((i) => i.village === v.name).length;
        const activeResolved = issues.filter((i) => i.village === v.name && i.status === 'Resolved').length;

        const total = v.base + activeTotal;
        const resolved = Math.round(v.base * v.rateBase) + activeResolved;
        const rate = Math.round((resolved / total) * 100);
        const { color, textColor } = getVillageColorPills(rate);

        return {
          name: v.name,
          label: getVillageLabel(v.name),
          total,
          resolved,
          rate,
          color,
          textColor
        };
      });
    }

    // Sort by rate descending initially to determine ranks
    list.sort((a, b) => b.rate - a.rate);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [villagePerformance, fallbackVillages, issues, language, t]);

  // Compute key stats for top section widget cards
  const stats = useMemo(() => {
    if (compiledVillageData.length === 0) {
      return { avgRate: 0, bestVillage: '-', criticalCount: 0 };
    }
    const sumRate = compiledVillageData.reduce((acc, curr) => acc + curr.rate, 0);
    const avgRate = Math.round(sumRate / compiledVillageData.length);
    
    // Best is the one with highest rate
    const sorted = [...compiledVillageData].sort((a, b) => b.rate - a.rate);
    const bestVillage = sorted[0]?.label || '-';
    const bestRate = sorted[0]?.rate || 0;

    // Critical villages are those with < 50% rate
    const criticalCount = compiledVillageData.filter((v) => v.rate < 50).length;

    return {
      avgRate,
      bestVillage: `${bestVillage} (${bestRate}%)`,
      criticalCount
    };
  }, [compiledVillageData]);

  // Apply search, filter, and sorting
  const processedVillageData = useMemo(() => {
    let result = [...compiledVillageData];

    // Search query filter
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (v) => v.name.toLowerCase().includes(query) || v.label.toLowerCase().includes(query)
      );
    }

    // Performance range filter
    if (filterOption === 'good') {
      result = result.filter((v) => v.rate >= 80);
    } else if (filterOption === 'warning') {
      result = result.filter((v) => v.rate < 50);
    }

    // Sort options
    if (sortOption === 'highest') {
      result.sort((a, b) => b.rate - a.rate);
    } else if (sortOption === 'lowest') {
      result.sort((a, b) => a.rate - b.rate);
    } else if (sortOption === 'issues') {
      result.sort((a, b) => b.total - a.total);
    } else if (sortOption === 'alphabetical') {
      result.sort((a, b) => a.label.localeCompare(b.label));
    }

    return result;
  }, [compiledVillageData, searchTerm, sortOption, filterOption]);

  // Bilingual Labels
  const isTelugu = language === 'te';
  const labelTotalVillages = isTelugu ? 'మొత్తం గ్రామాలు' : 'Total Villages';
  const labelAvgRate = isTelugu ? 'సగటు పరిష్కార రేటు' : 'Average Rate';
  const labelNeedsAttention = isTelugu ? 'శ్రద్ధ అవసరమైనవి' : 'Needs Attention';
  const labelSearchPlaceholder = isTelugu ? 'గ్రామం పేరుతో శోధించండి...' : 'Search village name...';
  const labelSortBy = isTelugu ? 'క్రమబద్ధీకరించు:' : 'Sort by:';
  const labelHighestRate = isTelugu ? 'అత్యధిక రేటు' : 'Highest Rate';
  const labelLowestRate = isTelugu ? 'అత్యల్ప రేటు' : 'Lowest Rate';
  const labelTotalIssues = isTelugu ? 'మొత్తం సమస్యలు' : 'Total Issues';
  const labelAlphabetical = isTelugu ? 'అక్షర క్రమం (A-Z)' : 'Alphabetical (A-Z)';
  const labelFilterAll = isTelugu ? 'అన్నీ' : 'All';
  const labelFilterGood = isTelugu ? 'అద్భుత ప్రదర్శన (≥80%)' : 'Good (≥80%)';
  const labelFilterWarning = isTelugu ? 'శ్రద్ధ అవసరం (<50%)' : 'Needs Attention (<50%)';
  const labelIssuesResolved = isTelugu ? 'పరిష్కరించబడిన సమస్యలు:' : 'Issues Resolved:';
  const labelIssuesPending = isTelugu ? 'పెండింగ్ సమస్యలు:' : 'Issues Pending:';
  const labelViewIssues = isTelugu ? 'గ్రామ సమస్యలు చూడండి' : 'View Issues';

  const toggleExpand = (villageName: string) => {
    setExpandedVillage(expandedVillage === villageName ? null : villageName);
  };

  return (
    <div id="page-villages-list" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header with Back Navigation */}
      <div className="raise-header" style={{ margin: '0 -14px 14px -14px' }}>
        <div className="raise-back" onClick={() => navigate('/dashboard')} style={{ transition: 'var(--transition)' }}>
          <i className="ti ti-arrow-left" aria-hidden="true"></i>
          <span>{t.backBtn}</span>
        </div>
        <div className="raise-title">{t.villagePerformance}</div>
      </div>

      {/* Error Banner */}
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
        }}>
          <i className="ti ti-alert-circle" style={{ fontSize: '14px' }}></i>
          <span>{error} (Using offline demo data)</span>
        </div>
      )}

      {/* Top statistics widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <div className="kpi" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <i className="ti ti-building-community" style={{ color: 'var(--gold-dark)', fontSize: '16px' }} aria-hidden="true" />
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
            {compiledVillageData.length}
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
            {labelTotalVillages}
          </div>
        </div>

        <div className="kpi" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <i className="ti ti-chart-bar" style={{ color: 'var(--green)', fontSize: '16px' }} aria-hidden="true" />
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: 'var(--green)' }}>
            {stats.avgRate}%
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
            {labelAvgRate}
          </div>
        </div>

        <div className="kpi" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <i className="ti ti-alert-triangle" style={{ color: stats.criticalCount > 0 ? 'var(--red)' : 'var(--text-muted)', fontSize: '16px' }} aria-hidden="true" />
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: stats.criticalCount > 0 ? 'var(--red)' : 'var(--text-primary)' }}>
            {stats.criticalCount}
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
            {labelNeedsAttention}
          </div>
        </div>
      </div>

      {/* Search & Sort Controls Card */}
      <div className="card" style={{ padding: '12px 14px', marginBottom: '14px' }}>
        {/* Search input */}
        <div className="input-with-icon" style={{ marginBottom: '10px' }}>
          <i className="ti ti-search" style={{ color: 'var(--text-muted)', fontSize: '16px' }} aria-hidden="true"></i>
          <input
            type="text"
            className="form-input"
            placeholder={labelSearchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '34px', paddingRight: '12px', height: '36px', borderRadius: '10px' }}
          />
        </div>

        {/* Filters and Sort layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Sorting drop-down */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{labelSortBy}</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              style={{
                background: '#f4f4f4',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'var(--text-primary)',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="highest">{labelHighestRate}</option>
              <option value="lowest">{labelLowestRate}</option>
              <option value="issues">{labelTotalIssues}</option>
              <option value="alphabetical">{labelAlphabetical}</option>
            </select>
          </div>

          {/* Filtering chips row */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setFilterOption('all')}
              style={{
                flexShrink: 0,
                background: filterOption === 'all' ? 'var(--gold-dark)' : '#f4f4f4',
                color: filterOption === 'all' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {labelFilterAll}
            </button>
            <button
              onClick={() => setFilterOption('good')}
              style={{
                flexShrink: 0,
                background: filterOption === 'good' ? 'var(--green)' : '#f4f4f4',
                color: filterOption === 'good' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {labelFilterGood}
            </button>
            <button
              onClick={() => setFilterOption('warning')}
              style={{
                flexShrink: 0,
                background: filterOption === 'warning' ? 'var(--red)' : '#f4f4f4',
                color: filterOption === 'warning' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {labelFilterWarning}
            </button>
          </div>
        </div>
      </div>

      {/* Villages List container */}
      <div className="village-list">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--gold-dark)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '12px'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{isTelugu ? 'డేటాను లోడ్ చేస్తోంది...' : 'Loading performance records...'}</span>
          </div>
        ) : processedVillageData.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <i className="ti ti-search" style={{ fontSize: '28px', marginBottom: '8px', display: 'block', color: '#ccc' }}></i>
            {isTelugu ? 'సరిపోలే గ్రామాలు ఏవీ లేవు.' : 'No villages match the selected filter parameters.'}
          </div>
        ) : (
          processedVillageData.map((v) => {
            const isExpanded = expandedVillage === v.name;
            return (
              <div
                key={v.name}
                className="card"
                onClick={() => toggleExpand(v.name)}
                style={{
                  padding: '12px 14px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  borderLeft: `4px solid ${v.rate >= 80 ? 'var(--green)' : v.rate >= 50 ? 'var(--gold)' : 'var(--red)'}`,
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transform: isExpanded ? 'translateY(-1px)' : 'none'
                }}
              >
                {/* Always visible summary row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className="vrank"
                    style={{
                      background: v.rank > 3 ? '#fecaca' : 'var(--gold)',
                      color: v.rank > 3 ? '#991b1b' : '#663300',
                      width: '24px',
                      height: '24px',
                      fontSize: '11px',
                      fontWeight: 800,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {v.rank}
                  </div>
                  <div className="vname" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'left' }}>
                    {v.label}
                  </div>
                  <div className="vcount" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {v.total} {t.issuesCountSuffix}
                  </div>
                  <span
                    className="vpill"
                    style={{
                      background: v.color,
                      color: v.textColor,
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      marginLeft: '4px'
                    }}
                  >
                    {v.rate}%
                  </span>
                  <i
                    className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`}
                    style={{ color: 'var(--text-muted)', fontSize: '14px', transition: 'var(--transition)' }}
                    aria-hidden="true"
                  />
                </div>

                {/* Expanded Accordion Panel */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border)',
                      animation: 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing accordion when clicking inside details
                  >
                    {/* Visual metrics grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: 'var(--green-bg)', padding: '8px 10px', borderRadius: '10px', textAlign: 'left' }}>
                        <div style={{ fontSize: '8px', color: 'var(--green-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          {labelIssuesResolved}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                          {v.resolved}
                        </div>
                      </div>
                      <div style={{ background: 'var(--red-bg)', padding: '8px 10px', borderRadius: '10px', textAlign: 'left' }}>
                        <div style={{ fontSize: '8px', color: 'var(--red-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          {labelIssuesPending}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--red)', marginTop: '2px' }}>
                          {v.total - v.resolved}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {t.resolutionRate}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: v.rate >= 80 ? 'var(--green)' : v.rate >= 50 ? 'var(--gold-dark)' : 'var(--red)' }}>
                          {v.rate}%
                        </span>
                      </div>
                      <div className="bar-track" style={{ height: '6px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          className="bar-fill"
                          style={{
                            width: `${v.rate}%`,
                            height: '100%',
                            borderRadius: '4px',
                            background: v.rate >= 80 ? 'var(--green)' : v.rate >= 50 ? 'var(--gold-dark)' : 'var(--red)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Navigation Link Button */}
                    <button
                      onClick={() => navigate(`/issues?village=${encodeURIComponent(v.name)}`)}
                      style={{
                        width: '100%',
                        background: 'var(--gold-bg)',
                        color: 'var(--gold-deep)',
                        border: '1px solid var(--gold-border)',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--gold)';
                        e.currentTarget.style.color = '#553300';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'var(--gold-bg)';
                        e.currentTarget.style.color = 'var(--gold-deep)';
                      }}
                    >
                      <span>{labelViewIssues}</span>
                      <i className="ti ti-arrow-right" style={{ fontSize: '13px' }}></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div style={{ height: '8px' }} />
    </div>
  );
};

export default VillagesList;
