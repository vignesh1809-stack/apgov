import React from 'react';
import type { Issue, FieldOfficer } from '../types';
import COPageHeader from '../components/COPageHeader';
import COFieldOfficerCard from '../components/COFieldOfficerCard';

interface COSelectFOProps {
  selectedIssueForAssign: Issue;
  fieldOfficers: FieldOfficer[];
  selectedFoId: string;
  setSelectedFoId: (id: string) => void;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (open: boolean) => void;
  onConfirmAssignment: () => void;
  onScreenChange: (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => void;
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

const COSelectFO: React.FC<COSelectFOProps> = ({
  selectedIssueForAssign,
  fieldOfficers,
  selectedFoId,
  setSelectedFoId,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  onConfirmAssignment,
  onScreenChange,
  t,
  language
}) => {
  const isTelugu = language === 'te';
  const parsed = parseIssue(selectedIssueForAssign.rawTitle);

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

  const selectedFo = fieldOfficers.find(fo => fo.id === selectedFoId);

  return (
    <div className="screen on" id="s-select" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F5F5' }}>
      <COPageHeader
        title={t.selectFieldOfficer}
        subTitle={isTelugu ? 'పనిభార క్రమంలో అమర్చబడింది — తక్కువ మొదట' : 'Sorted by workload — lightest first'}
        onBack={() => onScreenChange('assign')}
        backLabel={t.assignGrievances}
      >
        <div style={{ marginTop: '9px', background: 'var(--rbg)', border: '1px solid var(--rbd)', borderRadius: '12px', padding: '10px 13px', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <i className={getCategoryIcon(selectedIssueForAssign.category)} style={{ fontSize: '18px', color: 'var(--red)', flexShrink: 0 }}></i>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--rt)', lineHeight: 1.3 }}>
              {isTelugu && t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
                ? t.issueTitles[parsed.title as keyof typeof t.issueTitles] 
                : parsed.title}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="ti ti-map-pin" style={{ fontSize: '10px' }}></i>
              {getTranslatedVillage(selectedIssueForAssign.village)} · {getTranslatedPriority(parsed.urgency)} {isTelugu ? 'ప్రాధాన్యత' : 'Priority'}
            </div>
          </div>
        </div>
      </COPageHeader>

      <div className="scrl" style={{ padding: '12px 14px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          {[...fieldOfficers]
            .sort((a, b) => a.activeTasks - b.activeTasks)
            .map(fo => {
              const isSelected = selectedFoId === fo.id;
              const isOverloaded = fo.status === 'Overloaded';
              const isZoneMatch = selectedIssueForAssign.village.toLowerCase().includes(fo.village.split(' ')[0].toLowerCase());

              return (
                <COFieldOfficerCard
                  key={fo.id}
                  fo={fo}
                  language={language}
                  t={t}
                  isSelected={isSelected}
                  isZoneMatch={isZoneMatch}
                  onClick={() => !isOverloaded && setSelectedFoId(fo.id)}
                />
              );
            })}
        </div>
      </div>

      {/* Sticky footer for selected officer assignment */}
      <div style={{ padding: '10px 14px 18px', background: 'var(--w)', borderTop: '1px solid var(--brd)', flexShrink: 0 }}>
        <button
          className="btn-gold"
          disabled={!selectedFo}
          onClick={() => setIsConfirmModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: selectedFo ? 1 : 0.6 }}
        >
          <i className="ti ti-check" style={{ fontSize: '16px', fontWeight: 'bold' }}></i>
          {isTelugu 
            ? `${selectedFo ? selectedFo.name : 'ఫీల్డ్ అధికారిని ఎంచుకోండి'} కి కేటాయించు` 
            : `Assign to ${selectedFo ? selectedFo.name : 'Select Field Officer'}`}
        </button>
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--t3)', marginTop: '8px' }}>
          {selectedFo 
            ? (isTelugu ? `${selectedFo.name} కి వెంటనే సమాచారం అందుతుంది · ${selectedFo.activeTasks} ప్రస్తుత పనులు` : `${selectedFo.name} will be notified immediately · ${selectedFo.activeTasks} active tasks`) 
            : (isTelugu ? 'కొనసాగించడానికి క్రియాశీల ఫీల్డ్ అధికారిని ఎంచుకోండి' : 'Select an active field officer to proceed')}
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {isConfirmModalOpen && (
        <div className="modal-ov" onClick={() => setIsConfirmModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mh"></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gbg)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-user-check" style={{ fontSize: '20px', color: 'var(--gd)' }}></i>
              </div>
              <div className="modal-title">{t.confirmAssignmentTitle}</div>
            </div>
            <div className="modal-sub">
              {isTelugu ? (
                <span>&quot;{t.issueTitles[parsed.title as keyof typeof t.issueTitles] || parsed.title}&quot; ను <strong>{selectedFo?.name} ({selectedFoId})</strong> కి కేటాయిస్తున్నారు. ప్రస్తుతం అతని వద్ద {selectedFo?.activeTasks} పనులు ఉన్నాయి. మీరు ఎప్పుడైనా తిరిగి కేటాయించవచ్చు.</span>
              ) : (
                <span>Assigning &quot;{parsed.title}&quot; to <strong>{selectedFo?.name} ({selectedFoId})</strong>. He currently has {selectedFo?.activeTasks} active tasks. You can reassign at any time.</span>
              )}
            </div>
            <div className="modal-actions">
              <button className="mcl" onClick={() => setIsConfirmModalOpen(false)}>{t.cancel}</button>
              <button
                className="mco"
                style={{ background: 'var(--gold)', color: '#5a3f00' }}
                onClick={onConfirmAssignment}
              >
                <i className="ti ti-check" style={{ fontSize: '14px', verticalAlign: '-2px', marginRight: '4px' }}></i>
                {isTelugu ? 'అవును, కేటాయించు' : 'Yes, assign now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default COSelectFO;
