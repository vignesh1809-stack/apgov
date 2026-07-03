import React from 'react';
import type { Assignment } from '../types';
import FOPageHeader from '../components/FOPageHeader';
import FOAssignmentCard from '../components/FOAssignmentCard';

interface FOAssignmentsProps {
  assignments: Assignment[];
  totalAssigned: number;
  onScreenChange: (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => void;
  t: any;
  language: string;
}

const FOAssignments: React.FC<FOAssignmentsProps> = ({
  assignments,
  totalAssigned,
  onScreenChange,
  t,
  language
}) => {
  const highPriority = assignments.filter(a => a.urgency === 'High');
  const mediumPriority = assignments.filter(a => a.urgency === 'Medium');
  const lowPriority = assignments.filter(a => a.urgency === 'Low');

  return (
    <div className="screen on" id="s-tasks" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <FOPageHeader
        title={t.myAssignments}
        subTitle={t.sortedPriority}
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
      >
        <div style={{ marginTop: '8px', display: 'flex', gap: '7px' }}>
          <span className="chip chip-outline"><i className="ti ti-map-pin" style={{ fontSize: '11px' }}></i>Kuppam Town · Ward 1–6</span>
          <span className="chip chip-ghost">{totalAssigned} {t.tasksToday}</span>
        </div>
      </FOPageHeader>
      
      <div className="scroll" style={{ paddingTop: '6px' }}>

        {/* HIGH PRIORITY */}
        <div className="sec d1">
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--red)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--red)' }}>{t.highPriority}</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--red-bg)', color: 'var(--red-txt)', padding: '3px 9px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="pdot" style={{ width: '5px', height: '5px' }}></span>
            {highPriority.length}
          </span>
        </div>

        {highPriority.map((item, idx) => (
          <FOAssignmentCard
            key={item.id}
            item={item}
            idx={idx}
            showCitizen={true}
            language={language}
            t={t}
            onClick={() => onScreenChange('detail', item.id)}
          />
        ))}

        {/* MEDIUM PRIORITY */}
        <div className="sec d4">
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--ora)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--ora)' }}>{t.mediumPriority}</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--ora-bg)', color: 'var(--ora-txt)', padding: '3px 9px', borderRadius: '6px' }}>
            {mediumPriority.length}
          </span>
        </div>

        {mediumPriority.map((item, idx) => (
          <FOAssignmentCard
            key={item.id}
            item={item}
            idx={idx}
            language={language}
            t={t}
            onClick={() => onScreenChange('detail', item.id)}
          />
        ))}

        {/* LOW PRIORITY */}
        <div className="sec d5">
          <div className="sec-l">
            <div className="sec-bar" style={{ background: 'var(--grn)' }}></div>
            <div className="sec-ttl" style={{ color: 'var(--grn)' }}>{t.lowPriority}</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--grn-bg)', color: 'var(--grn-txt)', padding: '3px 9px', borderRadius: '6px' }}>
            {lowPriority.length}
          </span>
        </div>

        {lowPriority.map((item, idx) => (
          <FOAssignmentCard
            key={item.id}
            item={item}
            idx={idx}
            language={language}
            t={t}
            onClick={() => onScreenChange('detail', item.id)}
            style={{ marginBottom: idx === lowPriority.length - 1 ? '14px' : '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default FOAssignments;
