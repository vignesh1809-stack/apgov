import React from 'react';
import type { Issue, FieldOfficer } from '../types';
import COPageHeader from '../components/COPageHeader';

interface COReportsProps {
  resolvedIssues: Issue[];
  issues: Issue[];
  unassignedIssues: Issue[];
  fieldOfficers: FieldOfficer[];
  onScreenChange: (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => void;
  t: any;
  language: string;
}

const COReports: React.FC<COReportsProps> = ({
  resolvedIssues,
  issues,
  unassignedIssues,
  fieldOfficers,
  onScreenChange,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const busyCount = fieldOfficers.filter(f => f.status === 'Busy').length;

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
    <div className="screen on" id="s-reports" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F5F5' }}>
      <COPageHeader
        title={isTelugu ? 'మండల నివేదికలు' : 'Mandal Reports'}
        subTitle={isTelugu ? 'కుప్పం మండల పనితీరు నివేదిక' : 'Kuppam Mandal Performance Report'}
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
      >
        <div className="mc"><i className="ti ti-map-pin"></i>{isTelugu ? 'కుప్పం మండలం' : 'Kuppam Mandal'}</div>
      </COPageHeader>

      <div className="scrl" style={{ padding: '14px 14px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Resolution Speed Index Card */}
          <div style={{ background: 'var(--gbg)', border: '1.5px solid var(--gold-border)', borderRadius: '16px', padding: '16px', textAlign: 'left', boxShadow: 'var(--sh)' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--gdp)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isTelugu ? 'సమస్యల పరిష్కార వేగ సూచీ' : 'Resolution Speed Index'}</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--t1)', marginTop: '4px' }}>{isTelugu ? '92.4% సగటు స్కోరు' : '92.4% Average Score'}</div>
            <div style={{ fontSize: '11px', color: 'var(--t2)', marginTop: '4px', lineHeight: 1.4 }}>
              {isTelugu ? (
                <span>సగటు స్పందన సమయం <strong>2.8 గంటలు</strong> మరియు సగటు ముగింపు సమయం <strong>2.1 రోజులు</strong> కుప్పం మండలంలో నమోదైంది.</span>
              ) : (
                <span>Average response time is <strong>2.8 hours</strong> and average closure time is <strong>2.1 days</strong> across Kuppam Mandal.</span>
              )}
            </div>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: 'var(--w)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center', border: '1px solid var(--brd)', boxShadow: 'var(--sh)' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--grn)' }}>{resolvedIssues.length} / {issues.length}</div>
              <div style={{ fontSize: '9px', color: 'var(--t3)', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase' }}>{isTelugu ? 'పరిష్కరించినవి' : 'Issues Solved'}</div>
            </div>
            <div style={{ background: 'var(--w)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center', border: '1px solid var(--brd)', boxShadow: 'var(--sh)' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--red)' }}>{unassignedIssues.length}</div>
              <div style={{ fontSize: '9px', color: 'var(--t3)', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase' }}>{isTelugu ? 'కేటాయించనివి' : 'Unassigned'}</div>
            </div>
            <div style={{ background: 'var(--w)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center', border: '1px solid var(--brd)', boxShadow: 'var(--sh)' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ora)' }}>{busyCount}</div>
              <div style={{ fontSize: '9px', color: 'var(--t3)', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase' }}>{isTelugu ? 'బిజీగా ఉన్న అధికారులు' : 'Busy Officers'}</div>
            </div>
          </div>

          {/* Village Resolution Breakdown Section */}
          <div className="sec-row" style={{ padding: '8px 0 4px' }}>
            <div className="sec-l">
              <div className="sec-bar" style={{ background: 'var(--gold)' }} />
              <div className="sec-ttl" style={{ color: 'var(--t1)' }}>{isTelugu ? 'గ్రామాల వారీగా పరిష్కార వివరాలు' : 'Village Resolution Breakdown'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { village: 'Kuppam Town', count: 4, color: 'var(--grn)', pct: 100 },
              { village: 'Gudupalli', count: 2, color: 'var(--ora)', pct: 50 },
              { village: 'Ramagiri', count: 2, color: 'var(--ora)', pct: 50 },
              { village: 'Venkatapur', count: 2, color: 'var(--red)', pct: 0 }
            ].map((v, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'var(--t1)', background: 'var(--w)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '12px 14px', boxShadow: 'var(--sh)', textAlign: 'left' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--t1)' }}>{getTranslatedVillage(v.village)}</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '2px' }}>{v.count} {isTelugu ? 'మొత్తం సమస్యలు' : 'total grievances'}</div>
                </div>
                <span style={{ background: v.pct >= 80 ? 'var(--gbg2)' : v.pct >= 50 ? 'var(--obg)' : 'var(--rbg)', color: v.pct >= 80 ? 'var(--gt)' : v.pct >= 50 ? 'var(--ot)' : 'var(--rt)', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' }}>
                  {v.pct}% {isTelugu ? 'పరిష్కరించబడినవి' : 'solved'}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default COReports;
