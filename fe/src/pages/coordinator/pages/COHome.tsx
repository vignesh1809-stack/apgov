import React from 'react';
import type { Issue, FieldOfficer } from '../types';
import COKpiCard from '../components/COKpiCard';
import COIssueCard from '../components/COIssueCard';

interface COHomeProps {
  userName: string;
  unreadCount: number;
  unassignedIssues: Issue[];
  inProgressIssues: Issue[];
  resolvedIssues: Issue[];
  fieldOfficers: FieldOfficer[];
  onScreenChange: (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => void;
  onOpenAssignSelect: (issue: Issue) => void;
  onNotifClick: () => void;
  onSignOut: () => void;
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

const COHome: React.FC<COHomeProps> = ({
  userName,
  unreadCount,
  unassignedIssues,
  inProgressIssues,
  resolvedIssues,
  fieldOfficers,
  onScreenChange,
  onOpenAssignSelect,
  onNotifClick,
  onSignOut,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const urgentUnassigned = unassignedIssues.filter(i => parseIssue(i.rawTitle).urgency === 'High');

  return (
    <>
      <div className="topbar">
        <div className="trow">
          <div>
            <div className="greet">{t.greeting}</div>
            <div className="uname">{userName}</div>
          </div>
          <div
            className="nbell"
            style={{ cursor: 'pointer' }}
            onClick={onNotifClick}
          >
            <i className="ti ti-bell"></i>
            {unreadCount > 0 && (
              <div className="nbdg">{unreadCount}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '7px', marginTop: '9px', flexWrap: 'wrap' }}>
          <span className="role-chip"><i className="ti ti-sitemap" style={{ fontSize: '11px', marginRight: '3px' }}></i>{t.coordinatorGreetingSuffix}</span>
          <span className="mc"><i className="ti ti-map-pin"></i>{isTelugu ? 'కుప్పం మండలం' : 'Kuppam Mandal'}</span>
        </div>
      </div>

      <div className="scrl" style={{ padding: '14px 0 24px' }} id="scroll-area">
        {/* KPI Cards */}
        <div className="co-kpi-grid">
          <COKpiCard
            icon="ti ti-clipboard-list"
            iconBg="rgba(204,153,0,0.08)"
            iconColor="var(--gold-dark)"
            badgeText={isTelugu ? 'చేయవలసినవి' : 'To Do'}
            badgeClass="badge badge-orange"
            value={unassignedIssues.length}
            label={t.unassignedIssues}
            onClick={() => onScreenChange('assign')}
          />

          <COKpiCard
            icon="ti ti-users"
            iconBg="rgba(21,128,61,0.08)"
            iconColor="var(--grn)"
            badgeText={t.active}
            badgeClass="badge badge-green"
            value={fieldOfficers.length}
            label={t.fieldOfficers}
            onClick={() => onScreenChange('fos')}
          />

          <COKpiCard
            icon="ti ti-run"
            iconBg="rgba(217,119,6,0.08)"
            iconColor="var(--ora)"
            badgeText={t.pendingStatus}
            badgeStyle={{ background: 'var(--obg)', color: 'var(--ot)', border: '1px solid var(--obd)' }}
            value={inProgressIssues.length}
            valueColor="var(--ora)"
            label={t.inProgressIssues}
            onClick={() => onScreenChange('fos')}
          />

          <COKpiCard
            icon="ti ti-checkbox"
            iconBg="rgba(21,128,61,0.08)"
            iconColor="var(--grn)"
            badgeText={t.resolvedStatus}
            badgeClass="badge badge-green"
            value={resolvedIssues.length}
            valueColor="var(--grn)"
            label={isTelugu ? 'పరిష్కరించిన సమస్యలు' : 'Resolved Issues'}
          />
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '0 14px', marginBottom: '12px' }}>
          <button onClick={() => onScreenChange('assign')} style={{ background: 'var(--w)', border: '1px solid var(--brd)', borderRadius: '14px', padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', boxShadow: 'var(--sh)', outline: 'none' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--gbg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <i className="ti ti-user-plus" style={{ fontSize: '20px', color: 'var(--gd)' }}></i>
              {unassignedIssues.length > 0 && (
                <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: 'var(--red)', borderRadius: '50%', border: '2px solid var(--w)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '800', color: '#fff' }}>
                  {unassignedIssues.length}
                </div>
              )}
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--t2)' }}>{t.assignGrievances}</span>
          </button>

          <button onClick={() => onScreenChange('fos')} style={{ background: 'var(--w)', border: '1px solid var(--brd)', borderRadius: '14px', padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', boxShadow: 'var(--sh)', outline: 'none' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--gbg2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-users" style={{ fontSize: '20px', color: 'var(--grn)' }}></i>
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--t2)' }}>{t.fieldOfficers}</span>
          </button>

          <button onClick={() => onScreenChange('reports')} style={{ background: 'var(--w)', border: '1px solid var(--brd)', borderRadius: '14px', padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', boxShadow: 'var(--sh)', outline: 'none' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--rbg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-chart-bar" style={{ fontSize: '20px', color: 'var(--red)' }}></i>
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--t2)' }}>{isTelugu ? 'నివేదికలు' : 'Reports'}</span>
          </button>
        </div>

        {/* Section Header: Urgent · needs assignment */}
        <div className="sec-row" style={{ padding: '4px 14px 8px' }}>
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--red)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--red)' }}>{isTelugu ? 'అత్యవసరం · కేటాయింపు అవసరం' : 'Urgent · needs assignment'}</div>
          </div>
          <span className="sec-cnt" style={{ background: 'var(--rbg)', color: 'var(--rt)' }}>
            <span className="pdot" style={{ marginRight: '4px' }}></span>
            {urgentUnassigned.length} {isTelugu ? 'ఎక్కువ' : 'High'}
          </span>
        </div>

        {/* List of High priority unassigned issues (max 2) */}
        {unassignedIssues
          .map(i => ({ item: i, parsed: parseIssue(i.rawTitle) }))
          .sort((a, b) => {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.parsed.urgency] - priorityOrder[a.parsed.urgency];
          })
          .slice(0, 2)
          .map(({ item }) => (
            <COIssueCard
              key={item.id}
              item={item}
              language={language}
              t={t}
              onClick={() => onScreenChange('detail', item.id)}
              footerAction={
                <button
                  className="abtn"
                  style={{ background: 'var(--gold)', color: '#5a3f00' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAssignSelect(item);
                  }}
                >
                  <i className="ti ti-user-plus"></i>{isTelugu ? 'ఫీల్డ్ అధికారికి కేటాయించు' : 'Assign to field officer'}
                </button>
              }
            />
          ))
        }

        {/* View all unassigned button */}
        {unassignedIssues.length > 2 && (
          <div style={{ margin: '2px 14px 12px' }}>
            <button
              onClick={() => onScreenChange('assign')}
              style={{
                width: '100%',
                padding: '13px',
                background: 'var(--gbg)',
                border: '1.5px solid var(--gold)',
                borderRadius: '14px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                color: 'var(--gdp)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                outline: 'none'
              }}
            >
              <i className="ti ti-clipboard-list" style={{ fontSize: '16px' }}></i>
              {isTelugu ? `అన్ని ${unassignedIssues.length} కేటాయించనివి చూడు →` : `View all ${unassignedIssues.length} unassigned →`}
            </button>
          </div>
        )}

        {/* Section Header: Field officers · workload overview */}
        <div className="sec-row" style={{ padding: '8px 14px 8px' }}>
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--gold)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--t1)' }}>{isTelugu ? 'ఫీల్డ్ అధికారులు · కుప్పం మండలం' : 'Field officers · Kuppam Mandal'}</div>
          </div>
          <button
            onClick={() => onScreenChange('fos')}
            style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gd)', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
          >
            {t.seeAll} →
          </button>
        </div>

        {/* Field Officer workload overview */}
        <div className="fo-card" style={{ margin: '0 14px 14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fieldOfficers.slice(0, 3).map(fo => {
              const isAvailable = fo.status === 'Available';
              const isBusy = fo.status === 'Busy';
              const bgVal = isAvailable ? 'var(--gbg2)' : isBusy ? 'var(--obg)' : 'var(--rbg)';
              const txtVal = isAvailable ? 'var(--gt)' : isBusy ? 'var(--ot)' : 'var(--rt)';
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }} key={fo.id}>
                  <div className="fo-av" style={{ width: '32px', height: '32px', background: bgVal, color: txtVal, fontSize: '11px' }}>
                    {fo.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--t1)' }}>{fo.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--t3)' }}>{fo.activeTasks} {isTelugu ? 'పనులు' : 'tasks'} · {fo.id}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, background: bgVal, color: txtVal, padding: '2px 8px', borderRadius: '6px' }}>
                    {fo.status === 'Available' ? t.availableStatus : fo.status === 'Busy' ? t.busyStatus : t.overloadedStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Sign Out Link */}
        <div style={{ textAlign: 'center', marginTop: '18px', paddingBottom: '16px' }}>
          <button
            onClick={onSignOut}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--t3)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              outline: 'none'
            }}
          >
            {isTelugu ? 'కోఆర్డినేటర్ పోర్టల్ నుండి లాగ్ అవుట్' : 'Sign Out of Coordinator Portal'}
          </button>
        </div>
      </div>
    </>
  );
};

export default COHome;
