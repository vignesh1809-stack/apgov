import React from 'react';

interface FOKpiCardProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  badgeText: React.ReactNode;
  badgeBg: string;
  badgeColor: string;
  value: string | number;
  valueColor?: string;
  label: string;
  onClick?: () => void;
}

const FOKpiCard: React.FC<FOKpiCardProps> = ({
  icon,
  iconColor,
  iconBg,
  badgeText,
  badgeBg,
  badgeColor,
  value,
  valueColor,
  label,
  onClick
}) => {
  return (
    <div 
      className="kpi glass" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="kpi-top">
        <div className="kpi-ico" style={{ background: iconBg, padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <i className={icon} aria-hidden="true" style={{ color: iconColor }}></i>
        </div>
        <span className="kpi-bdg" style={{ background: badgeBg, color: badgeColor }}>
          {badgeText}
        </span>
      </div>
      <div className="kpi-num" style={{ color: valueColor }}>
        {value}
      </div>
      <div className="kpi-lbl">{label}</div>
    </div>
  );
};

export default FOKpiCard;
