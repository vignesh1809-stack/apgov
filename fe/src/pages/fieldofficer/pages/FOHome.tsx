import React from 'react';
import type { Assignment } from '../types';
import FOKpiCard from '../components/FOKpiCard';
import FORouteStopItem from '../components/FORouteStopItem';
import FOAssignmentCard from '../components/FOAssignmentCard';

interface FOHomeProps {
  assignments: Assignment[];
  totalAssigned: number;
  resolvedCount: number;
  visitedCount: number;
  pendingCount: number;
  onScreenChange: (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => void;
  onSignOut: () => void;
  t: any;
  language: string;
}

const getStatusClass = (status: string) => {
  if (status === 'Resolved') return 'spill resolved';
  if (status === 'En route') return 'spill visited';
  if (status === 'Visited') return 'spill visited';
  return 'spill pending';
};

const FOHome: React.FC<FOHomeProps> = ({
  assignments,
  totalAssigned,
  resolvedCount,
  visitedCount,
  pendingCount,
  onScreenChange,
  onSignOut,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const highPriorityPendingCount = assignments.filter(a => a.urgency === 'High' && a.status !== 'Resolved').length;
  const urgentAssignments = assignments.filter(a => a.urgency === 'High' && a.status !== 'Resolved');

  return (
    <div className="screen on" id="s-home">
      <div className="topbar" style={{ display: 'block' }}>
        <div className="trow">
          <div>
            <div className="greet">{t.greeting}, {t.officerGreetingSuffix}</div>
            <div className="uname" style={{ textAlign: 'left' }}>Suresh Reddy</div>
          </div>
          <div className="nbell" onClick={() => onScreenChange('stats')}>
            <i className="ti ti-chart-bar" aria-hidden="true"></i>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '9px', flexWrap: 'wrap' }}>
          <div className="role-chip"><i className="ti ti-shield-check" aria-hidden="true"></i>FO-KUP-042</div>
          <div className="vchip"><i className="ti ti-map-pin" aria-hidden="true"></i>Ward 1–6 · Kuppam Town</div>
          <button 
            onClick={onSignOut}
            style={{ 
              marginLeft: 'auto', 
              background: 'rgba(220, 38, 38, 0.08)', 
              border: '1px solid rgba(220, 38, 38, 0.2)', 
              borderRadius: '12px', 
              padding: '4px 10px', 
              fontSize: '10px', 
              fontWeight: '700', 
              color: 'var(--red)', 
              cursor: 'pointer' 
            }}
          >
            {t.signOut}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        {/* KPI cards */}
        <div className="kpi-grid d1" style={{ padding: '0 14px' }}>
          <FOKpiCard
            icon="ti ti-clipboard-list"
            iconColor="var(--gold-dark)"
            iconBg="var(--gold-bg)"
            badgeText={isTelugu ? 'నేడు' : 'Today'}
            badgeBg="var(--gold-bg)"
            badgeColor="var(--gold-deep)"
            value={totalAssigned}
            label={t.assignedTasks}
            onClick={() => onScreenChange('tasks')}
          />
          
          <FOKpiCard
            icon="ti ti-circle-check"
            iconColor="var(--green)"
            iconBg="var(--green-bg)"
            badgeText={`↑ ${resolvedCount - 5 >= 0 ? `+${resolvedCount - 5}` : resolvedCount}`}
            badgeBg="var(--green-bg)"
            badgeColor="var(--green-text)"
            value={resolvedCount}
            valueColor="var(--green)"
            label={t.resolvedToday}
            onClick={() => onScreenChange('stats')}
          />

          <FOKpiCard
            icon="ti ti-walk"
            iconColor="#ea580c"
            iconBg="#fff7ed"
            badgeText={t.active}
            badgeBg="#fff7ed"
            badgeColor="#9a3412"
            value={visitedCount}
            valueColor="#ea580c"
            label={t.visitedToday}
            onClick={() => onScreenChange('stats')}
          />

          <FOKpiCard
            icon="ti ti-clock-hour-4"
            iconColor="var(--red)"
            iconBg="var(--red-bg)"
            badgeText={
              <>
                <span className="pdot" style={{ width: '5px', height: '5px', marginRight: '2px' }}></span>
                {isTelugu ? 'అత్యవసరం' : 'Urgent'}
              </>
            }
            badgeBg="var(--red-bg)"
            badgeColor="var(--red-text)"
            value={pendingCount}
            valueColor="var(--red)"
            label={t.pendingStatus}
            onClick={() => onScreenChange('tasks')}
          />
        </div>

        {/* Today's route */}
        <div className="sec-hdr d2">
          <div className="sec-left">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{t.todaysRoute}</div>
          </div>
          <span className="sec-cnt">{totalAssigned} {t.stops}</span>
        </div>

        <div className="glass d2" style={{ margin: '0 14px 10px', borderRadius: '18px', padding: '13px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--gold-bg)', border: '1px solid var(--gold-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-route" aria-hidden="true" style={{ fontSize: '18px', color: 'var(--gold-dark)' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>Kuppam Town · Ward 1 → 6</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>~6.4 km · Est. 4h 20m · {highPriorityPendingCount} {t.highPriority.toLowerCase()}</div>
            </div>
          </div>
          
          {/* Route stop list summary (Stops 1-3) */}
          {assignments.slice(0, 3).map((stop) => (
            <FORouteStopItem
              key={stop.id}
              stop={stop}
              language={language}
              onClick={() => onScreenChange('detail', stop.id)}
              rightElement={
                <span className={getStatusClass(stop.status)}>
                  {stop.status === 'En route' ? t.active : stop.status === 'Resolved' ? (isTelugu ? 'పూర్తయింది' : 'Done') : t.pendingStatus}
                </span>
              }
            />
          ))}

          <button onClick={() => onScreenChange('map')} style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'var(--gold)', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#663300', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            <i className="ti ti-navigation" aria-hidden="true" style={{ fontSize: '15px' }}></i>{t.openRouteMap}
          </button>
        </div>

        {/* Urgent */}
        <div className="sec-hdr d3">
          <div className="sec-left">
            <div className="sec-bar" style={{ background: 'var(--red)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--red)' }}>{t.urgentActNow}</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--red-text)', background: 'var(--red-bg)', padding: '2px 8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(220, 38, 38, 0.2)', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="pdot" style={{ width: '5px', height: '5px' }}></span>
            {highPriorityPendingCount} {t.pendingStatus.toLowerCase()}
          </span>
        </div>

        {/* Show first pending high priority assignment */}
        {urgentAssignments.slice(0, 1).map((item) => (
          <FOAssignmentCard
            key={item.id}
            item={item}
            variant="urgent"
            language={language}
            t={t}
            onClick={() => onScreenChange('detail', item.id)}
          />
        ))}

        <button onClick={() => onScreenChange('tasks')} style={{ margin: '2px 14px 14px', width: 'calc(100% - 28px)', padding: '13px', background: 'var(--gold-bg)', border: '1.5px solid var(--gold)', borderRadius: '14px', fontSize: '13px', fontWeight: '800', color: 'var(--gold-deep)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
          <i className="ti ti-clipboard-list" aria-hidden="true" style={{ fontSize: '16px' }}></i>{t.seeAll} {totalAssigned} {isTelugu ? 'కేటాయింపులు' : 'assignments'} →
        </button>
      </div>
    </div>
  );
};

export default FOHome;
