import React from 'react';

interface COKpiCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeText: string;
  badgeClass?: string;
  badgeStyle?: React.CSSProperties;
  value: string | number;
  valueColor?: string;
  label: string;
  onClick?: () => void;
}

const COKpiCard: React.FC<COKpiCardProps> = ({
  icon,
  iconBg,
  iconColor,
  badgeText,
  badgeClass = 'badge',
  badgeStyle,
  value,
  valueColor,
  label,
  onClick
}) => {
  return (
    <div 
      className="co-kpi-card" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="co-kpi-header">
        <div className="co-kpi-icon" style={{ background: iconBg }}>
          <i className={icon} style={{ color: iconColor, fontSize: '18px' }} />
        </div>
        <span className={badgeClass} style={badgeStyle}>
          {badgeText}
        </span>
      </div>
      <div className="co-kpi-num" style={{ color: valueColor }}>
        {value}
      </div>
      <div className="co-kpi-lbl">{label}</div>
    </div>
  );
};

export default COKpiCard;
