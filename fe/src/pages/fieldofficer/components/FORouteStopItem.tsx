import React from 'react';
import type { Assignment } from '../types';

interface FORouteStopItemProps {
  stop: Assignment;
  language: string;
  rightElement?: React.ReactNode;
  onClick: () => void;
}

const FORouteStopItem: React.FC<FORouteStopItemProps> = ({
  stop,
  language,
  rightElement,
  onClick
}) => {
  return (
    <div 
      className="route-stop" 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div 
        className="route-num" 
        style={{ 
          background: stop.status === 'Resolved' ? 'var(--green-bg)' : stop.status === 'En route' ? '#fff7ed' : 'var(--red-bg)', 
          color: stop.status === 'Resolved' ? 'var(--green-text)' : stop.status === 'En route' ? '#9a3412' : 'var(--red-text)' 
        }}
      >
        {stop.status === 'Resolved' ? (
          <i className="ti ti-check" aria-hidden="true" style={{ fontSize: '12px' }}></i>
        ) : stop.status === 'En route' ? (
          <i className="ti ti-walk" aria-hidden="true" style={{ fontSize: '12px' }}></i>
        ) : (
          <span>{stop.stopNum}</span>
        )}
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: stop.status === 'Resolved' ? 'var(--green-text)' : stop.status === 'En route' ? '#9a3412' : 'var(--text-primary)' }}>
          {language === 'te' ? 'స్టాప్' : 'Stop'} {stop.stopNum} — {stop.citizenName}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          {stop.ward}, {stop.village} · {stop.category} · {stop.time || stop.distance}
        </div>
      </div>
      {rightElement}
    </div>
  );
};

export default FORouteStopItem;
