import React from 'react';
import type { Issue } from '../types';
import COPageHeader from '../components/COPageHeader';

interface COIssueDetailProps {
  currentIssue: Issue;
  userName: string;
  onScreenChange: (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => void;
  onOpenAssignSelect: (issue: Issue) => void;
  t: any;
  language: string;
}

const parseIssue = (rawTitle: string) => {
  const parts = rawTitle.split('||');
  return {
    title: parts[0] || rawTitle,
    description: parts[1] || 'No description provided.',
    urgency: (parts[2] || 'Medium') as 'High' | 'Medium' | 'Low',
  };
};



const getUrgencyClass = (urgency: 'High' | 'Medium' | 'Low') => {
  if (urgency === 'High') return 'badge-red';
  if (urgency === 'Medium') return 'badge-orange';
  return 'badge-green';
};

const COIssueDetail: React.FC<COIssueDetailProps> = ({
  currentIssue,
  userName,
  onScreenChange,
  onOpenAssignSelect,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const parsed = parseIssue(currentIssue.rawTitle);
  const urgencyClass = getUrgencyClass(parsed.urgency);
  const isPending = currentIssue.status === 'Pending';
  const isResolved = currentIssue.status === 'Resolved';
  const isInProgress = currentIssue.status === 'In Progress';

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

  return (
    <div className="screen on" id="s-detail" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F5F5' }}>
      <COPageHeader
        title={t.grievanceDetails}
        subTitle={isTelugu ? `సమస్య సూచిక సంఖ్య: #GRIEV-2026-0${currentIssue.id}` : `Grievance Ref: #GRIEV-2026-0${currentIssue.id}`}
        onBack={() => onScreenChange(isPending ? 'assign' : 'home')}
        backLabel={isPending ? (isTelugu ? 'కేటాయించనివి' : 'Unassigned') : (isTelugu ? 'డ్యాష్ బోర్డ్' : 'Dashboard')}
      />

      <div className="scrl" style={{ paddingBottom: '30px' }}>
        <div style={{ background: 'var(--w)', padding: '16px 18px', borderBottom: '1px solid var(--brd)', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="badge" style={{
              background: isResolved ? 'var(--gbg2)' : isInProgress ? 'var(--obg)' : 'var(--surf)',
              color: isResolved ? 'var(--gt)' : isInProgress ? 'var(--ot)' : 'var(--t2)',
              border: '1px solid transparent'
            }}>
              {currentIssue.status === 'Resolved' ? t.resolvedStatus : currentIssue.status === 'In Progress' ? t.inProgressStatus : t.pendingStatus}
            </span>
            <span className={`badge ${urgencyClass}`}>{isTelugu ? `${getTranslatedPriority(parsed.urgency)} ప్రాధాన్యత` : `${parsed.urgency} Priority`}</span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--t1)', lineHeight: '1.4' }}>
            {isTelugu && t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
              ? t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
              : parsed.title}
          </h3>
          <div className="mc" style={{ marginTop: '10px' }}>
            <i className="ti ti-map-pin" />
            {getTranslatedVillage(currentIssue.village)}
          </div>
        </div>

        {/* Grievance Description */}
        <div className="sec-row" style={{ paddingTop: '14px' }}>
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--gold)' }} />
            <div className="sec-ttl" style={{ color: 'var(--t1)' }}>{t.descriptionLabel}</div>
          </div>
        </div>

        <div style={{ background: 'var(--w)', margin: '0 14px 14px', borderRadius: '16px', padding: '14px 16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--sh)', textAlign: 'left' }}>
          <p style={{ fontSize: '13px', color: 'var(--t1)', lineHeight: '1.6' }}>{parsed.description}</p>
        </div>

        {/* Citizen Details */}
        <div className="sec-row">
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--gold)' }} />
            <div className="sec-ttl" style={{ color: 'var(--t1)' }}>{isTelugu ? 'పౌరుడి సంప్రదింపు వివరాలు' : 'Citizen Contact Details'}</div>
          </div>
        </div>

        <div style={{ background: 'var(--w)', margin: '0 14px 14px', borderRadius: '16px', padding: '14px 16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--sh)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--t2)', fontSize: '13px' }}>
              {currentIssue.reporter.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--t1)' }}>{currentIssue.reporter}</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '1px' }}>
                {isTelugu ? `ఆంధ్రప్రదేశ్ పౌరుడు · ${getTranslatedVillage(currentIssue.village.split(' · ')[0])}` : `AP Citizen · ${currentIssue.village.split(' · ')[0]}`}
              </div>
            </div>
          </div>
          <a
            href={`tel:${currentIssue.phone}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--gbg)',
              border: '1.5px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <i className="ti ti-phone" style={{ fontSize: '16px', color: 'var(--gd)' }} />
          </a>
        </div>

        {/* History Timeline */}
        <div className="sec-row">
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--gold)' }} />
            <div className="sec-ttl" style={{ color: 'var(--t1)' }}>{t.issueTimeline}</div>
          </div>
        </div>

        <div className="timeline-box">
          {/* Step 1: Raised */}
          <div className="timeline-step">
            <div className="timeline-icon-col">
              <div className="timeline-dot completed" />
              <div className="timeline-line" />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">{isTelugu ? 'పౌరుడి ద్వారా समस्या నమోదైంది' : 'Grievance Registered by Citizen'}</div>
              <div className="timeline-time">{isTelugu ? currentIssue.date.replace('days ago', 'రోజుల క్రితం').replace('day ago', 'రోజు క్రితం').replace('Resolved today', 'నేడు పరిష్కరించబడింది') : currentIssue.date}</div>
              <div className="timeline-desc">{isTelugu ? 'ఏపీ జనసేవ మొబైల్ పౌర యాప్ ద్వారా సమర్పించబడింది. రెఫరెన్స్ టోకెన్ సృష్టించబడింది.' : 'Submitted via AP Jana Seva mobile citizen application. Ref token generated.'}</div>
            </div>
          </div>

          {/* Step 2: Coordinator Pending */}
          <div className="timeline-step">
            <div className="timeline-icon-col">
              <div className={`timeline-dot ${isPending ? 'active' : 'completed'}`} />
              {(isInProgress || isResolved) && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-title">{isTelugu ? 'మండల కోఆర్డినేటర్ పరిశీలనలో ఉంది' : 'Pending Mandal Coordinator Review'}</div>
              <div className="timeline-time">{isTelugu ? currentIssue.date.replace('days ago', 'రోజుల క్రితం').replace('day ago', 'రోజు క్రితం').replace('Resolved today', 'నేడు పరిష్కరించబడింది') : currentIssue.date}</div>
              <div className="timeline-desc">{isTelugu ? 'అధికారి పంపకం కోసం కుప్పం మండల క్యూలో కేటాయించబడింది.' : 'Assigned to Kuppam Mandal queue for Officer dispatch.'}</div>
            </div>
          </div>

          {/* Step 3: FO Assigned */}
          {(isInProgress || isResolved) && (
            <div className="timeline-step">
              <div className="timeline-icon-col">
                <div className={`timeline-dot ${isInProgress ? 'active' : 'completed'}`} />
                {isResolved && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-title">{isTelugu ? 'ఫీల్డ్ అధికారి కేటాయించబడ్డారు & పంపబడ్డారు' : 'Field Officer Assigned & Dispatched'}</div>
                <div className="timeline-time">{isTelugu ? 'ఇప్పుడే కేటాయించబడింది' : 'Assigned just now'}</div>
                <div className="timeline-desc">{isTelugu ? `కోఆర్డినేటర్ ${userName} ద్వారా ${currentIssue.assignedTo} కి కేటాయించబడింది. ఫీల్డ్ సందర్శన కోసం అధికారికి సమాచారం అందించబడింది.` : `Assigned to ${currentIssue.assignedTo} by Coordinator ${userName}. FO notified for field visit.`}</div>
              </div>
            </div>
          )}

          {/* Step 4: Resolved */}
          {isResolved && (
            <div className="timeline-step">
              <div className="timeline-icon-col">
                <div className="timeline-dot completed" />
              </div>
              <div className="timeline-content">
                <div className="timeline-title">{isTelugu ? 'సమస్య పరిష్కరించబడింది' : 'Grievance Resolved'}</div>
                <div className="timeline-time">{isTelugu ? currentIssue.date.replace('days ago', 'రోజుల క్రితం').replace('day ago', 'రోజు క్రితం').replace('Resolved today', 'నేడు పరిష్కరించబడింది') : currentIssue.date}</div>
                <div className="timeline-desc">{isTelugu ? 'ఫీల్డ్ అధికారి క్షేత్రస్థాయి పనులు పూర్తి చేసి, ధృవీకరించిన ఫోటో సాక్ష్యాలను అప్‌లోడ్ చేశారు. సమస్య పరిష్కరించబడింది.' : 'Field Officer completed site work, uploaded verified photo proof, and resolved status. Citizen feedback submitted.'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Sticky Footer if Pending */}
      {isPending && (
        <div style={{ background: 'var(--w)', padding: '12px 16px 18px', borderTop: '1px solid var(--brd)', flexShrink: 0 }}>
          <button
            onClick={() => onOpenAssignSelect(currentIssue)}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--gold)',
              border: 'none',
              borderRadius: '16px',
              color: '#5a3f00',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <i className="ti ti-shield-check" style={{ fontSize: '15px' }} />
            {isTelugu ? 'ఫీల్డ్ అధికారిని వెంటనే కేటాయించు' : 'Assign Field Officer Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default COIssueDetail;
