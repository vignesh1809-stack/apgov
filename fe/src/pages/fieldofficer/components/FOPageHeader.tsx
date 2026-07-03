import React from 'react';

interface FOPageHeaderProps {
  title: string;
  subTitle?: string;
  onBack: () => void;
  backLabel: string;
  variant?: 'default' | 'page';
  children?: React.ReactNode;
}

const FOPageHeader: React.FC<FOPageHeaderProps> = ({
  title,
  subTitle,
  onBack,
  backLabel,
  variant = 'default',
  children
}) => {
  if (variant === 'page') {
    return (
      <div className="page-header" style={{ display: 'block', textAlign: 'left' }}>
        <div className="back-row" onClick={onBack} style={{ cursor: 'pointer' }}>
          <i className="ti ti-arrow-left" aria-hidden="true"></i>
          <span>{backLabel}</span>
        </div>
        <div className="page-title">{title}</div>
        {subTitle && <div className="page-sub">{subTitle}</div>}
        {children}
      </div>
    );
  }

  return (
    <div className="hdr">
      <div className="back" onClick={onBack} style={{ cursor: 'pointer' }}>
        <i className="ti ti-arrow-left"></i>
        <span>{backLabel}</span>
      </div>
      <div className="h-title">{title}</div>
      {subTitle && <div className="h-sub">{subTitle}</div>}
      {children}
    </div>
  );
};

export default FOPageHeader;
