import React from 'react';
import type { FieldOfficer } from '../types';

interface COFieldOfficerCardProps {
  fo: FieldOfficer;
  language: string;
  t: any;
  isSelected?: boolean;
  isZoneMatch?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const COFieldOfficerCard: React.FC<COFieldOfficerCardProps> = ({
  fo,
  language,
  t,
  isSelected = false,
  isZoneMatch = false,
  isExpanded = false,
  onToggleExpand,
  onClick,
  style
}) => {
  const isTelugu = language === 'te';
  const isOverloaded = fo.status === 'Overloaded';
  const capacityPct = Math.min((fo.activeTasks / 8) * 100, 100);

  const isAvailable = fo.status === 'Available';
  const isBusy = fo.status === 'Busy';
  const bgVal = isAvailable ? 'var(--gbg2)' : isBusy ? 'var(--obg)' : 'var(--rbg)';
  const txtVal = isAvailable ? 'var(--gt)' : isBusy ? 'var(--ot)' : 'var(--rt)';
  const barColor = isAvailable ? 'var(--grn)' : isBusy ? 'var(--ora)' : 'var(--red)';

  const cardBorder = isSelected ? '2.5px solid var(--gold)' : '1px solid rgba(0,0,0,0.04)';

  return (
    <div
      className="fo-card"
      onClick={onClick || onToggleExpand}
      style={{
        border: cardBorder,
        position: 'relative',
        opacity: isOverloaded && onClick ? 0.55 : 1, // Only fade if selectable/clickable
        cursor: isOverloaded && onClick ? 'not-allowed' : 'pointer',
        padding: '13px 14px',
        ...style
      }}
    >
      {isSelected && (
        <div style={{ position: 'absolute', top: '10px', right: '12px', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-check" style={{ fontSize: '12px', color: '#5a3f00', fontWeight: 'bold' }}></i>
        </div>
      )}

      <div className="fo-head">
        <div className="fo-av" style={{ background: bgVal, color: txtVal, border: isSelected ? '2px solid var(--gold)' : 'none' }}>
          {fo.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="fo-name" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {fo.name}
            {isZoneMatch && (
              <span style={{ background: 'var(--gbg)', color: 'var(--gdp)', border: '1px solid var(--gold-border)', fontSize: '9px', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                {isTelugu ? 'జోన్ సరిపోయింది' : 'Zone Match'}
              </span>
            )}
          </div>
          <div className="fo-id">
            {isTelugu ? fo.designation.replace('Ward', 'వార్డు').replace('Kuppam Town', 'కుప్పం టౌన్') : fo.designation} · {fo.id}
          </div>
        </div>
        <span className="fo-badge" style={{ background: bgVal, color: txtVal, marginRight: isSelected ? '28px' : '0' }}>
          {fo.status === 'Available' ? t.availableStatus : fo.status === 'Busy' ? t.busyStatus : t.overloadedStatus}
        </span>
      </div>

      {/* Warning banner for overloaded FOs */}
      {isOverloaded && !onClick && (
        <div style={{ background: 'var(--rbg)', display: 'flex', alignItems: 'center', gap: '9px', borderRadius: '10px', padding: '8px 10px', marginBottom: '9px', textAlign: 'left' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: '15px', color: 'var(--red)', flexShrink: 0 }}></i>
          <div style={{ fontSize: '11px', color: 'var(--rt)' }}>
            {isTelugu ? `${fo.activeTasks} పనులు కేటాయించబడ్డాయి — మరిన్ని జోడించే ముందు తిరిగి కేటాయించండి` : `${fo.activeTasks} tasks assigned — reassign before adding more`}
          </div>
        </div>
      )}

      <div className="fo-stats">
        <div className="fo-stat">
          <div className="fo-stat-n">{fo.activeTasks}</div>
          <div className="fo-stat-l">{isTelugu ? 'ప్రస్తుత పనులు' : 'Active'}</div>
        </div>
        <div className="fo-stat">
          <div className="fo-stat-n" style={{ color: 'var(--grn)' }}>{fo.resolvedTasks}</div>
          <div className="fo-stat-l">{isTelugu ? 'పరిష్కరించినవి' : 'Resolved'}</div>
        </div>
        <div className="fo-stat">
          <div className="fo-stat-n">{fo.avgCloseTime}</div>
          <div className="fo-stat-l">{isTelugu ? 'సగటు పరిష్కారం' : 'Avg close'}</div>
        </div>
      </div>

      <div className="wbar-track">
        <div className="wbar-fill" style={{ width: `${capacityPct}%`, background: barColor }}></div>
      </div>
      <div className="wcap">
        <span>{isTelugu ? `${Math.round(capacityPct)}% సామర్థ్యం` : `${Math.round(capacityPct)}% capacity`}</span>
        <span style={{ fontWeight: 700, color: barColor }}>{fo.activeTasks} / 8 {isTelugu ? 'పనులు' : 'tasks'}</span>
      </div>

      {/* Interactive Expandable Active Tasks List */}
      {onToggleExpand && (
        <div
          style={{
            maxHeight: isExpanded ? '300px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out, margin-top 0.3s',
            marginTop: isExpanded ? '12px' : '0px',
            borderTop: isExpanded ? '1px solid var(--brd)' : 'none',
            paddingTop: isExpanded ? '10px' : '0px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--t1)', marginBottom: '8px' }}>
            {isTelugu ? `ప్రస్తుత కేటాయింపులు (${fo.activeTasks})` : `Active Assignments (${fo.activeTasks})`}
          </div>
          {fo.tasksList.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--t3)', fontStyle: 'italic' }}>
              {isTelugu ? 'యాక్టివ్ కేటాయింపులు ఏవీ లేవు. అందుబాటులో ఉన్నారు.' : 'No active assignments. Available for dispatch.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {fo.tasksList.map((task, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surf)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--t1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="ti ti-chevron-right" style={{ color: 'var(--gd)' }} />
                  <span>{isTelugu && t.issueTitles[task as keyof typeof t.issueTitles] ? t.issueTitles[task as keyof typeof t.issueTitles] : task}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {onToggleExpand && (
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#ccc', marginTop: '10px' }}>
          <i className={isExpanded ? 'ti ti-chevron-up' : 'ti ti-chevron-down'} style={{ fontSize: '12px', verticalAlign: '-1px', marginRight: '3px' }} />
          {isExpanded ? (isTelugu ? 'వివరాలను దాచడానికి నొక్కండి' : 'Tap to collapse details') : (isTelugu ? 'కేటాయించిన సమస్యలను చూడటానికి నొక్కండి' : 'Tap to expand assigned issues')}
        </div>
      )}
    </div>
  );
};

export default COFieldOfficerCard;
