import React from 'react';
import type { Issue } from '../types';

interface COIssueCardProps {
  item: Issue;
  language: string;
  t: any;
  onClick: () => void;
  footerAction?: React.ReactNode;
}

const parseIssue = (rawTitle: string) => {
  const parts = rawTitle.split('||');
  return {
    title: parts[0] || rawTitle,
    description: parts[1] || 'No description provided.',
    urgency: (parts[2] || 'Medium') as 'High' | 'Medium' | 'Low',
  };
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road / Infra': return 'ti ti-road';
    case 'Water supply': return 'ti ti-droplet';
    case 'Electricity': return 'ti ti-bolt';
    case 'Health': return 'ti ti-first-aid-kit';
    case 'Education': return 'ti ti-school';
    default: return 'ti ti-clipboard-list';
  }
};

const COIssueCard: React.FC<COIssueCardProps> = ({
  item,
  language,
  t,
  onClick,
  footerAction
}) => {
  const isTelugu = language === 'te';
  const parsed = parseIssue(item.rawTitle);

  const getTranslatedPriority = (urg: 'High' | 'Medium' | 'Low') => {
    if (urg === 'High') return isTelugu ? 'ఎక్కువ' : 'High';
    if (urg === 'Medium') return isTelugu ? 'మధ్యస్థ' : 'Medium';
    return isTelugu ? 'తక్కువ' : 'Low';
  };

  const getTranslatedVillage = (vil: string) => {
    let result = vil;
    if (vil.includes('Kuppam')) {
      result = vil.replace('Kuppam Town', isTelugu ? 'కుప్పం టౌన్' : 'Kuppam Town');
    } else if (vil.includes('Ramagiri')) {
      result = vil.replace('Ramagiri village', isTelugu ? 'రామగిరి గ్రామం' : 'Ramagiri village');
    } else if (vil.includes('Gudupalli')) {
      result = vil.replace('Gudupalli village', isTelugu ? 'గుడుపల్లి గ్రామం' : 'Gudupalli village');
    } else if (vil.includes('Venkatapur')) {
      result = vil.replace('Venkatapur village', isTelugu ? 'వెంకటాపురం గ్రామం' : 'Venkatapur village');
    } else if (vil.includes('Bethampudi')) {
      result = vil.replace('Bethampudi village', isTelugu ? 'బెతంపూడి గ్రామం' : 'Bethampudi village');
    }
    if (isTelugu) {
      result = result.replace('Ward', 'వార్డు');
    }
    return result;
  };

  const accentColor = parsed.urgency === 'High' ? 'var(--red)' : parsed.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)';
  const backgroundPill = parsed.urgency === 'High' ? 'var(--rbg)' : parsed.urgency === 'Medium' ? 'var(--obg)' : 'var(--gbg2)';
  const textPill = parsed.urgency === 'High' ? 'var(--rt)' : parsed.urgency === 'Medium' ? 'var(--ot)' : 'var(--gt)';

  return (
    <div className="ic" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="ia" style={{ background: accentColor }}></div>
      <div className="ic-body">
        <div className="ic-ico" style={{ background: backgroundPill }}>
          <i className={getCategoryIcon(item.category)} style={{ color: accentColor }}></i>
        </div>
        <div className="ic-txt">
          <div className="ic-row">
            <div className="ic-ttl">
              {isTelugu && t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
                ? t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
                : parsed.title}
            </div>
            <span className="pp" style={{ background: backgroundPill, color: textPill }}>
              {getTranslatedPriority(parsed.urgency)}
            </span>
          </div>
          <div className="ic-vil"><i className="ti ti-map-pin"></i>{getTranslatedVillage(item.village)}</div>
          <div className="ic-av">
            <div className="av-sm">{item.reporter.split(' ').map(n => n[0]).join('')}</div>
            <div className="ic-meta">
              {item.reporter} · {isTelugu ? item.date.replace('days ago', 'రోజుల క్రితం').replace('day ago', 'రోజు క్రితం').replace('Resolved today', 'నేడు పరిష్కరించబడింది') : item.date}
            </div>
          </div>
        </div>
      </div>
      {footerAction && (
        <div className="ic-foot">
          {footerAction}
        </div>
      )}
    </div>
  );
};

export default COIssueCard;
