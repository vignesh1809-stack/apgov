import React from 'react';
import type { Issue } from '../types';
import COPageHeader from '../components/COPageHeader';
import COIssueCard from '../components/COIssueCard';

interface COAssignProps {
  unassignedIssues: Issue[];
  priorityFilter: 'All' | 'High' | 'Medium' | 'Low';
  setPriorityFilter: (filter: 'All' | 'High' | 'Medium' | 'Low') => void;
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

const COAssign: React.FC<COAssignProps> = ({
  unassignedIssues,
  priorityFilter,
  setPriorityFilter,
  onScreenChange,
  onOpenAssignSelect,
  t,
  language
}) => {
  const isTelugu = language === 'te';

  const highPriority = unassignedIssues.filter(i => parseIssue(i.rawTitle).urgency === 'High');
  const mediumPriority = unassignedIssues.filter(i => parseIssue(i.rawTitle).urgency === 'Medium');
  const lowPriority = unassignedIssues.filter(i => parseIssue(i.rawTitle).urgency === 'Low');

  return (
    <div className="screen on" id="s-assign" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F5F5' }}>
      <COPageHeader
        title={t.assignGrievances}
        subTitle={isTelugu ? `${unassignedIssues.length} కేటాయించనివి · ప్రాధాన్యత క్రమంలో` : `${unassignedIssues.length} unassigned · sorted High → Low`}
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
      >
        <div className="mc"><i className="ti ti-map-pin"></i>{isTelugu ? 'కుప్పం మండలం' : 'Kuppam Mandal'}</div>
      </COPageHeader>

      {/* Interactive filter tabs */}
      <div className="chip-row">
        <div
          className="chip"
          style={priorityFilter === 'All' ? { background: 'var(--gold)', color: '#5a3f00' } : { background: 'var(--surf)', color: 'var(--t2)' }}
          onClick={() => setPriorityFilter('All')}
        >
          {t.allFilter} ({unassignedIssues.length})
        </div>
        <div
          className="chip"
          style={priorityFilter === 'High' ? { background: 'var(--red)', color: '#fff' } : { background: 'var(--rbg)', color: 'var(--rt)', borderColor: 'var(--rbd)' }}
          onClick={() => setPriorityFilter('High')}
        >
          {isTelugu ? 'ఎక్కువ' : 'High'} ({highPriority.length})
        </div>
        <div
          className="chip"
          style={priorityFilter === 'Medium' ? { background: 'var(--ora)', color: '#fff' } : { background: 'var(--obg)', color: 'var(--ot)', borderColor: 'var(--obd)' }}
          onClick={() => setPriorityFilter('Medium')}
        >
          {isTelugu ? 'మధ్యస్థం' : 'Medium'} ({mediumPriority.length})
        </div>
        <div
          className="chip"
          style={priorityFilter === 'Low' ? { background: 'var(--grn)', color: '#fff' } : { background: 'var(--gbg2)', color: 'var(--gt)', borderColor: 'var(--gbd2)' }}
          onClick={() => setPriorityFilter('Low')}
        >
          {isTelugu ? 'తక్కువ' : 'Low'} ({lowPriority.length})
        </div>
      </div>

      <div className="scrl" style={{ paddingTop: '6px', paddingBottom: '24px' }}>
        {unassignedIssues.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--t3)' }}>
            <i className="ti ti-clipboard-check" style={{ fontSize: '48px', color: 'var(--grn)', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>{isTelugu ? 'అన్ని సమస్యలు కేటాయించబడ్డాయి!' : 'All grievances assigned!'}</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>{isTelugu ? 'మండల క్యూలో పెండింగ్ సమస్యలు ఏవీ లేవు.' : 'There are no pending issues in the mandal queue.'}</div>
          </div>
        )}

        {/* High Priority Section */}
        {(priorityFilter === 'All' || priorityFilter === 'High') && highPriority.length > 0 && (
          <>
            <div className="sec-row">
              <div className="sec-l">
                <div className="sec-bar" style={{ background: 'var(--red)' }}></div>
                <div className="sec-ttl" style={{ color: 'var(--red)' }}>{isTelugu ? 'అత్యధిక ప్రాధాన్యత' : 'High priority'}</div>
              </div>
              <span className="sec-cnt" style={{ background: 'var(--rbg)', color: 'var(--rt)' }}>
                <span className="pdot" style={{ marginRight: '4px' }}></span>
                {highPriority.length} {isTelugu ? 'సమస్య' : (highPriority.length === 1 ? 'issue' : 'issues')}
              </span>
            </div>
            {highPriority.map(item => (
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
            ))}
          </>
        )}

        {/* Medium Priority Section */}
        {(priorityFilter === 'All' || priorityFilter === 'Medium') && mediumPriority.length > 0 && (
          <>
            <div className="sec-row" style={{ marginTop: '10px' }}>
              <div className="sec-l">
                <div className="sec-bar" style={{ background: 'var(--ora)' }}></div>
                <div className="sec-ttl" style={{ color: 'var(--ora)' }}>{isTelugu ? 'మధ్యస్థ ప్రాధాన్యత' : 'Medium priority'}</div>
              </div>
              <span className="sec-cnt" style={{ background: 'var(--obg)', color: 'var(--ot)' }}>
                {mediumPriority.length} {isTelugu ? 'సమస్య' : (mediumPriority.length === 1 ? 'issue' : 'issues')}
              </span>
            </div>
            {mediumPriority.map(item => (
              <COIssueCard
                key={item.id}
                item={item}
                language={language}
                t={t}
                onClick={() => onScreenChange('detail', item.id)}
                footerAction={
                  <button
                    className="abtn"
                    style={{ background: 'var(--obg)', border: '1px solid var(--obd)', color: 'var(--ot)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAssignSelect(item);
                    }}
                  >
                    <i className="ti ti-user-plus"></i>{isTelugu ? 'ఫీల్డ్ అధికారికి కేటాయించు' : 'Assign to field officer'}
                  </button>
                }
              />
            ))}
          </>
        )}

        {/* Low Priority Section */}
        {(priorityFilter === 'All' || priorityFilter === 'Low') && lowPriority.length > 0 && (
          <>
            <div className="sec-row" style={{ marginTop: '10px' }}>
              <div className="sec-l">
                <div className="sec-bar" style={{ background: 'var(--grn)' }}></div>
                <div className="sec-ttl" style={{ color: 'var(--grn)' }}>{isTelugu ? 'తక్కువ ప్రాధాన్యత' : 'Low priority'}</div>
              </div>
              <span className="sec-cnt" style={{ background: 'var(--gbg2)', color: 'var(--gt)' }}>
                {lowPriority.length} {isTelugu ? 'సమస్య' : (lowPriority.length === 1 ? 'issue' : 'issues')}
              </span>
            </div>
            {lowPriority.map(item => (
              <COIssueCard
                key={item.id}
                item={item}
                language={language}
                t={t}
                onClick={() => onScreenChange('detail', item.id)}
                footerAction={
                  <button
                    className="abtn"
                    style={{ background: 'var(--gbg2)', border: '1px solid var(--gbd2)', color: 'var(--gt)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAssignSelect(item);
                    }}
                  >
                    <i className="ti ti-user-plus"></i>{isTelugu ? 'ఫీల్డ్ అధికారికి కేటాయించు' : 'Assign to field officer'}
                  </button>
                }
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default COAssign;
