import React from 'react';

interface COPageHeaderProps {
  title: string;
  subTitle?: string;
  onBack: () => void;
  backLabel: string;
  children?: React.ReactNode;
}

const COPageHeader: React.FC<COPageHeaderProps> = ({
  title,
  subTitle,
  onBack,
  backLabel,
  children
}) => {
  return (
    <div className="hdr">
      <div className="back" onClick={onBack} style={{ cursor: 'pointer' }}>
        <i className="ti ti-arrow-left"></i>
        <span>{backLabel}</span>
      </div>
      <div className="ptitle">{title}</div>
      {subTitle && <div className="psub">{subTitle}</div>}
      {children}
    </div>
  );
};

export default COPageHeader;
