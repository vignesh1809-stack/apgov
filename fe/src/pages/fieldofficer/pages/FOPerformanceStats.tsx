import React from 'react';
import type { Assignment } from '../types';
import FOPageHeader from '../components/FOPageHeader';
import FOKpiCard from '../components/FOKpiCard';

interface FOPerformanceStatsProps {
  assignments: Assignment[];
  resolvedCount: number;
  onScreenChange: (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => void;
  t: any;
  language: string;
}

const FOPerformanceStats: React.FC<FOPerformanceStatsProps> = ({
  assignments,
  resolvedCount,
  onScreenChange,
  t,
  language
}) => {
  const escalatedCount = assignments.filter(a => a.time === 'Escalated to MLA').length;
  const isTelugu = language === 'te';

  return (
    <div className="screen on" id="s-stats">
      <FOPageHeader
        title={t.myPerformance}
        subTitle="Suresh Reddy · FO-KUP-042"
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
        variant="page"
      >
        <div className="village-tag"><i className="ti ti-map-pin" aria-hidden="true"></i>Kuppam Town · Ward 1–6</div>
      </FOPageHeader>

      <div style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        <div className="kpi-grid d1" style={{ padding: '0 14px' }}>
          <FOKpiCard
            icon="ti ti-calendar"
            iconColor="var(--gold-dark)"
            iconBg="var(--gold-bg)"
            badgeText={isTelugu ? 'నేడు' : 'Today'}
            badgeBg="var(--gold-bg)"
            badgeColor="var(--gold-deep)"
            value={resolvedCount}
            label={t.resolvedToday}
          />
          <FOKpiCard
            icon="ti ti-chart-bar"
            iconColor="var(--green)"
            iconBg="var(--green-bg)"
            badgeText={isTelugu ? 'ఈ వారం' : 'This week'}
            badgeBg="var(--green-bg)"
            badgeColor="var(--green-text)"
            value={18 + resolvedCount}
            valueColor="var(--green)"
            label={isTelugu ? 'ఈ వారం పరిష్కరించినవి' : 'Resolved this week'}
          />
          <FOKpiCard
            icon="ti ti-clock"
            iconColor="var(--gold-dark)"
            iconBg="var(--gold-bg)"
            badgeText={isTelugu ? 'వేగంగా' : '↓ faster'}
            badgeBg="var(--green-bg)"
            badgeColor="var(--green-text)"
            value="1.8d"
            valueColor="var(--gold-dark)"
            label={t.avgCloseTime}
          />
          <FOKpiCard
            icon="ti ti-arrow-up"
            iconColor="var(--red)"
            iconBg="var(--red-bg)"
            badgeText="MLA"
            badgeBg="var(--red-bg)"
            badgeColor="var(--red-text)"
            value={escalatedCount}
            valueColor="var(--red)"
            label={t.escalateLabel}
          />
        </div>

        {/* Rating */}
        <div className="glass d2" style={{ margin: '0 14px 10px', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '10px' }}>{t.citizenSatisfactionLabel}</div>
          <div style={{ fontSize: '38px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px' }}>4.6</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
            <i className="ti ti-star" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
            <i className="ti ti-star" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
            <i className="ti ti-star" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
            <i className="ti ti-star" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
            <i className="ti ti-star-half" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{t.basedOnRatings.replace('this week', '')} ({18 + resolvedCount} {isTelugu ? 'రేటింగ్‌లు' : 'ratings'})</div>
        </div>

        {/* Resolved by category */}
        <div className="sec-hdr d3">
          <div className="sec-left">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{t.resolvedByCategory}</div>
          </div>
          <span className="sec-cnt">{isTelugu ? 'ఈ వారం' : 'This week'}</span>
        </div>
        
        <div className="glass d3" style={{ margin: '0 14px 8px', borderRadius: '16px', padding: '14px' }}>
          <div className="bar-row"><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.roadInfra}</div><div className="bar-track"><div className="bar-fill" style={{ width: '78%', background: 'var(--gold)' }}></div></div><div className="bar-num">8</div></div>
          <div className="bar-row"><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.waterSupply}</div><div className="bar-track"><div className="bar-fill" style={{ width: '52%', background: '#60a5fa' }}></div></div><div className="bar-num">5</div></div>
          <div className="bar-row"><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.electricity}</div><div className="bar-track"><div className="bar-fill" style={{ width: '40%', background: '#facc15' }}></div></div><div className="bar-num">4</div></div>
          <div className="bar-row"><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.health}</div><div className="bar-track"><div className="bar-fill" style={{ width: '30%', background: 'var(--red)' }}></div></div><div className="bar-num">3</div></div>
          <div className="bar-row"><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.education}</div><div className="bar-track"><div className="bar-fill" style={{ width: '20%', background: '#4ade80' }}></div></div><div className="bar-num">2</div></div>
          <div className="bar-row" style={{ marginBottom: 0 }}><div className="bar-lbl" style={{ textAlign: 'left' }}>{t.personal}</div><div className="bar-track"><div className="bar-fill" style={{ width: '10%', background: '#c084fc' }}></div></div><div className="bar-num">1</div></div>
        </div>

        {/* Village breakdown */}
        <div className="sec-hdr d4">
          <div className="sec-left">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{t.byVillage}</div>
          </div>
        </div>

        <div className="glass d4" style={{ margin: '0 14px 8px', borderRadius: '16px', padding: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#f8f8f8', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '15px', color: 'var(--gold-dark)' }}></i>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.kuppam}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ward 1–4</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--green)' }}>12</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolvedStatus.toLowerCase()}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#f8f8f8', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '15px', color: 'var(--gold-dark)' }}></i>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.ramagiri}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ward 2</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--green)' }}>5</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolvedStatus.toLowerCase()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#f8f8f8', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '15px', color: 'var(--gold-dark)' }}></i>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.venkatapur}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ward 5</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--green)' }}>4</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolvedStatus.toLowerCase()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#f8f8f8', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '15px', color: 'var(--gold-dark)' }}></i>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.bethampudi}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ward 6</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--gold-dark)' }}>2</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t.resolvedStatus.toLowerCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FOPerformanceStats;
