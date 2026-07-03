import React from 'react';
import type { Assignment } from '../types';

interface FOAssignmentCardProps {
  item: Assignment;
  variant?: 'urgent' | 'detailed';
  showCitizen?: boolean;
  language: string;
  t: any;
  onClick: () => void;
  idx?: number;
  style?: React.CSSProperties;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road / Infra': return 'ti ti-road';
    case 'Water supply': return 'ti ti-droplet';
    case 'Electricity': return 'ti ti-bolt';
    case 'Health': return 'ti ti-first-aid-kit';
    case 'Education': return 'ti ti-school';
    case 'Environment': return 'ti ti-tree';
    default: return 'ti ti-clipboard-list';
  }
};

const FOAssignmentCard: React.FC<FOAssignmentCardProps> = ({
  item,
  variant = 'detailed',
  showCitizen = false,
  language,
  t,
  onClick,
  idx = 0,
  style
}) => {
  const isTelugu = language === 'te';

  if (variant === 'urgent') {
    return (
      <div 
        className="acard glass-red d3" 
        onClick={onClick}
        style={{ cursor: 'pointer', ...style }}
      >
        <div className="acard-accent" style={{ background: 'var(--red)' }}></div>
        <div className="acard-inner">
          <div className="acard-hdr">
            <div className="acard-ico" style={{ background: 'rgba(254,202,202,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={getCategoryIcon(item.category)} aria-hidden="true" style={{ color: 'var(--red)' }}></i>
            </div>
            <div className="acard-body">
              <div className="acard-top">
                <div className="acard-title">{item.title}</div>
                <span className="ppill h">{t.highLabel}</span>
              </div>
              <div className="acard-village">
                <i className="ti ti-map-pin" aria-hidden="true"></i>{item.village} · {item.ward}
              </div>
              <div className="acard-meta">
                {isTelugu ? 'స్థితి' : 'Status'}: {item.status === 'Resolved' ? t.resolvedStatus : item.status === 'En route' ? t.inProgressStatus : t.pendingStatus} · {isTelugu ? 'దూరం' : 'Distance'}: {item.distance} · {isTelugu ? 'పౌరుడు' : 'Citizen'}: {item.citizenName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 'detailed' variant (.tc card style)
  let borderLeftColor = 'var(--grn)';
  let urgencyClass = 'pp pp-l';
  let urgencyLabel = isTelugu ? 'తక్కువ' : 'Low';
  if (item.urgency === 'High') {
    borderLeftColor = 'var(--red)';
    urgencyClass = 'pp pp-h';
    urgencyLabel = isTelugu ? 'ఎక్కువ' : 'High';
  } else if (item.urgency === 'Medium') {
    borderLeftColor = 'var(--ora)';
    urgencyClass = 'pp pp-m';
    urgencyLabel = isTelugu ? 'మధ్యస్థం' : 'Med';
  }

  const callBg = item.urgency === 'High' ? 'var(--red-bg)' : item.urgency === 'Medium' ? 'var(--ora-bg)' : 'var(--grn-bg)';
  const callIconColor = item.urgency === 'High' ? 'var(--red)' : item.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)';

  return (
    <div 
      className={`tc d${idx + 2}`} 
      onClick={onClick}
      style={{ position: 'relative', cursor: 'pointer', ...style }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: borderLeftColor }}></div>
      <div className="tc-inner">
        <div className="tc-row">
          <div className="tc-ico" style={{ background: item.urgency === 'High' ? 'var(--red-bg)' : item.urgency === 'Medium' ? 'var(--ora-bg)' : 'var(--grn-bg)' }}>
            <i className={getCategoryIcon(item.category)} style={{ color: item.urgency === 'High' ? 'var(--red)' : item.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)' }}></i>
          </div>
          <div className="tc-body">
            <div className="tc-top">
              <div className="tc-title">{item.title}</div>
              <span className={urgencyClass}>{urgencyLabel}</span>
            </div>
            <div className="tc-village"><i className="ti ti-map-pin"></i>{item.village} · {item.ward}</div>
            <div className="tc-meta">
              {isTelugu ? 'నమోదైంది' : 'Raised'} {item.time} · {item.status === 'Resolved' ? t.resolvedStatus : item.status === 'En route' ? t.inProgressStatus : (isTelugu ? 'సందర్శించలేదు' : 'Unvisited')}
            </div>
          </div>
        </div>

        {showCitizen && (
          <div className="tc-citizen" onClick={(e) => e.stopPropagation()}>
            <div className="tc-citizen-av">{item.citizenName.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ textAlign: 'left' }}>
              <div className="tc-citizen-name">{item.citizenName}</div>
              <div className="tc-citizen-ph">{item.phone}</div>
            </div>
            <button 
              className="tc-call" 
              style={{ background: callBg }} 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.location.href = `tel:${item.phone}`; 
              }}
            >
              <i className="ti ti-phone" style={{ fontSize: '15px', color: callIconColor }}></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FOAssignmentCard;
