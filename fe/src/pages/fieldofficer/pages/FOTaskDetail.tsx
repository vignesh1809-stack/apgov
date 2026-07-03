import React from 'react';
import type { Assignment } from '../types';
import FOPageHeader from '../components/FOPageHeader';

interface FOTaskDetailProps {
  currentAssignment: Assignment;
  fieldNotes: string;
  setFieldNotes: (notes: string) => void;
  isPhotoSelected: boolean;
  setIsPhotoSelected: (selected: boolean) => void;
  escalateModalOpen: boolean;
  setEscalateModalOpen: (open: boolean) => void;
  onMarkVisited: () => void;
  onEscalate: () => void;
  onScreenChange: (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => void;
  showToast: (msg: string) => void;
  t: any;
  language: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road / Infra': return 'ti ti-road';
    case 'Water supply': return 'ti ti-droplet';
    case 'Electricity': return 'ti ti-bolt';
    case 'Health': return 'ti ti-first-aid-kit';
    case 'Education': return 'ti ti-school';
    case 'Environment': return 'ti ti-tree';
    default: return 'ti ti-clipboard-list';
  }
};

const FOTaskDetail: React.FC<FOTaskDetailProps> = ({
  currentAssignment,
  fieldNotes,
  setFieldNotes,
  isPhotoSelected,
  setIsPhotoSelected,
  escalateModalOpen,
  setEscalateModalOpen,
  onMarkVisited,
  onEscalate,
  onScreenChange,
  showToast,
  t,
  language
}) => {
  const isTelugu = language === 'te';

  return (
    <div className="screen on" id="s-detail" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <FOPageHeader
        title={currentAssignment.title}
        onBack={() => onScreenChange('tasks')}
        backLabel={isTelugu ? 'కేటాయింపులు' : 'Assignments'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          <span className={`pp ${currentAssignment.urgency === 'High' ? 'pp-h' : currentAssignment.urgency === 'Medium' ? 'pp-m' : 'pp-l'}`} style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 11px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentAssignment.urgency === 'High' ? 'var(--red)' : currentAssignment.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)', animation: currentAssignment.urgency === 'High' ? 'beat 1.7s ease infinite' : 'none', display: 'inline-block' }}></span>
            {currentAssignment.urgency === 'High' ? t.highPriority : currentAssignment.urgency === 'Medium' ? t.mediumPriority : t.lowPriority}
          </span>
          <span className="chip chip-ghost" style={{ fontSize: '10px' }}>#KUP-2025-00{currentAssignment.id}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', borderRadius: '8px', padding: '4px 11px', marginTop: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--gold-txt)' }}>
          <i className="ti ti-map-pin" style={{ fontSize: '11px' }}></i>{currentAssignment.village} · {currentAssignment.ward}
        </div>
      </FOPageHeader>

      <div className="scroll" style={{ paddingBottom: '0px' }}>
        <div className="sec d1">
          <div className="sec-l">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{isTelugu ? 'పౌరుడు' : 'Citizen'}</div>
          </div>
        </div>
        
        <div className="det-citizen d1">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '13px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '13px' }}>
            <div className="det-cit-av">{currentAssignment.citizenName.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text1)', textAlign: 'left' }}>{currentAssignment.citizenName}</div>
              <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '2px', textAlign: 'left' }}>{currentAssignment.address}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="det-cit-av" style={{ width: '38px', height: '38px', background: 'var(--gold-bg)', border: '1.5px solid var(--gold-bd)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', borderStyle: 'solid' }} onClick={() => window.location.href = `tel:${currentAssignment.phone}`}>
                <i className="ti ti-phone" style={{ fontSize: '18px', color: 'var(--gold-dk)' }}></i>
              </button>
              <button className="det-cit-av" style={{ width: '38px', height: '38px', background: 'var(--grn-bg)', border: '1.5px solid var(--grn-bd)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', borderStyle: 'solid' }} onClick={() => showToast('Messaging citizen is not supported in demo mode')}>
                <i className="ti ti-message" style={{ fontSize: '18px', color: 'var(--grn)' }}></i>
              </button>
            </div>
          </div>
          <div className="dir"><span className="dk">{t.phone}</span><span className="dv" style={{ color: 'var(--gold-dk)' }}>{currentAssignment.phone}</span></div>
          <div className="dir"><span className="dk">{t.villageLabel}</span><span className="dv">{currentAssignment.village} · {currentAssignment.ward}</span></div>
          <div className="dir"><span className="dk">{isTelugu ? 'దూరం' : 'Distance'}</span><span className="dv" style={{ color: 'var(--ora)' }}>{currentAssignment.distance} {isTelugu ? 'దూరంలో' : 'away'}</span></div>
          <button 
            style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'var(--ora-bg)', border: '1.5px solid var(--ora-bd)', borderRadius: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', fontWeight: 800, color: 'var(--ora-txt)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
            onClick={() => onScreenChange('map')}
          >
            <i className="ti ti-navigation" style={{ fontSize: '15px' }}></i>{t.navigateTo} {currentAssignment.village}
          </button>
        </div>

        <div className="sec d2">
          <div className="sec-l">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{isTelugu ? 'సమస్య' : 'Issue'}</div>
          </div>
        </div>

        <div className="det-info d2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '11px', paddingBottom: '11px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ width: '36px', height: '36px', background: currentAssignment.urgency === 'High' ? 'var(--red-bg)' : currentAssignment.urgency === 'Medium' ? 'var(--ora-bg)' : 'var(--grn-bg)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={getCategoryIcon(currentAssignment.category)} style={{ fontSize: '18px', color: currentAssignment.urgency === 'High' ? 'var(--red)' : currentAssignment.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: currentAssignment.urgency === 'High' ? 'var(--red)' : currentAssignment.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                {currentAssignment.category} · {currentAssignment.urgency === 'High' ? t.highPriority : currentAssignment.urgency === 'Medium' ? t.mediumPriority : t.lowPriority}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text2)', marginTop: '2px' }}>{isTelugu ? 'నమోదైంది' : 'Raised'} {currentAssignment.time} · {t.photoAttached}</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.65', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)', textAlign: 'left' }}>
            {currentAssignment.description}
          </div>
          <div style={{ height: '72px', background: currentAssignment.urgency === 'High' ? 'var(--red-bg)' : currentAssignment.urgency === 'Medium' ? 'var(--ora-bg)' : 'var(--grn-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '5px', cursor: 'pointer' }} onClick={() => setIsPhotoSelected(true)}>
            <i className="ti ti-photo" style={{ fontSize: '26px', color: currentAssignment.urgency === 'High' ? 'var(--red)' : currentAssignment.urgency === 'Medium' ? 'var(--ora)' : 'var(--grn)' }}></i>
            <span style={{ fontSize: '10px', color: currentAssignment.urgency === 'High' ? 'var(--red-txt)' : currentAssignment.urgency === 'Medium' ? 'var(--ora-txt)' : 'var(--grn-txt)', fontWeight: 700 }}>
              {isPhotoSelected ? t.photoAttachedSuccess : t.citizenPhotoTap}
            </span>
          </div>
        </div>

        <div className="sec d3">
          <div className="sec-l">
            <div className="sec-bar"></div>
            <div className="sec-ttl">{t.issueTimeline}</div>
          </div>
        </div>

        <div className="det-info d3" style={{ marginBottom: currentAssignment.status === 'Resolved' ? '20px' : '80px' }}>
          <div className="tl-item">
            <div className="tl-dc"><div className="tl-dot" style={{ background: 'var(--gold-dk)' }}></div><div className="tl-ln"></div></div>
            <div className="tl-bd">
              <div className="tl-label">{t.raisedByCitizen}</div>
              <div className="tl-note">{t.submittedBy} {currentAssignment.citizenName} {t.withLocationVerification}</div>
              <div className="tl-time">14 Jun · 11:20 AM</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dc"><div className="tl-dot" style={{ background: 'var(--gold-dk)' }}></div><div className="tl-ln"></div></div>
            <div className="tl-bd">
              <div className="tl-label">{t.acknowledgedByMla}</div>
              <div className="tl-note">{t.assignedTo} FO-KUP-042 · Suresh Reddy</div>
              <div className="tl-time">14 Jun · 2:00 PM</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dc">
              <div className="tl-dot" style={{ background: currentAssignment.status === 'Resolved' ? 'var(--grn)' : 'var(--ora)' }}></div>
              {currentAssignment.status === 'Resolved' ? null : <div className="tl-ln"></div>}
            </div>
            <div className="tl-bd">
              <div className="tl-label" style={{ color: currentAssignment.status === 'Resolved' ? 'var(--grn)' : 'var(--ora)' }}>
                {currentAssignment.status === 'Resolved' ? t.resolvedByFo : t.assignedToYouPending}
              </div>
              <div className="tl-note">
                {currentAssignment.status === 'Resolved' ? `${t.resolvedWithNotes}: "${currentAssignment.notes}"` : `${t.visit} Venkatapur · ${t.meetCitizen}`}
              </div>
              <div className="tl-time">{currentAssignment.status === 'Resolved' ? t.justNow : t.awaitingVisit}</div>
            </div>
          </div>

          {/* Field notes card (if unresolved) */}
          {currentAssignment.status !== 'Resolved' && (
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '15px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '7px', textAlign: 'left' }}>
                {t.fieldNotesLabel}
              </div>
              <textarea 
                className="form-input" 
                rows={2} 
                placeholder={t.fieldNotesPlaceholder}
                style={{ resize: 'none', padding: '12px', width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', height: '80px', fontFamily: 'inherit', fontSize: '12px' }}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>
      </div>

      {/* Sticky actions — Airbnb style */}
      {currentAssignment.status !== 'Resolved' && (
        <div className="sticky-actions">
          <button 
            className="act-btn" 
            style={{ background: 'var(--gold-bg)', border: '1.5px solid var(--gold-bd)', color: 'var(--gold-txt)' }}
            onClick={() => {
              setIsPhotoSelected(true);
              showToast('GPS Location Checked In & Verified');
            }}
          >
            <i className="ti ti-location-check" style={{ fontSize: '17px' }}></i>{t.markVisitedGps}
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="act-btn" 
              style={{ background: 'var(--grn-bg)', border: '1.5px solid var(--grn-bd)', color: 'var(--grn-txt)', marginBottom: 0 }}
              onClick={onMarkVisited}
            >
              <i className="ti ti-circle-check" style={{ fontSize: '16px' }}></i>{t.resolveLabel}
            </button>
            <button 
              className="act-btn" 
              style={{ background: 'var(--red-bg)', border: '1.5px solid var(--red-bd)', color: 'var(--red-txt)', marginBottom: 0 }}
              onClick={() => setEscalateModalOpen(true)}
            >
              <i className="ti ti-arrow-up" style={{ fontSize: '16px' }}></i>{t.escalateLabel}
            </button>
          </div>
        </div>
      )}

      {/* Escalate Confirmation Sheet */}
      {escalateModalOpen && (
        <div className="modal-overlay open" style={{ display: 'flex', position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, boxSizing: 'border-box' }} onClick={() => setEscalateModalOpen(false)}>
          <div className="modal-sheet" style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', padding: '20px 22px 32px', width: '100%', position: 'absolute', bottom: 0, left: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle"></div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text1)', marginBottom: '8px', textAlign: 'left' }}>{t.escalateGrievanceTitle}</div>
            <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', textAlign: 'left' }}>{t.escalateGrievanceDesc}</p>
            
            <div className="escalate-card" style={{ marginTop: '12px', textAlign: 'left', padding: '10px', background: 'var(--red-bg)', borderRadius: '12px', border: '1px solid var(--red-bd)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--red-txt)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="ti ti-alert-circle" aria-hidden="true"></i>{t.escalationDetails}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--red-txt)', marginTop: '4px', lineHeight: '1.4' }}>
                <strong>{t.assignee}:</strong> Suresh Reddy (FO-KUP-042)<br/>
                <strong>{t.grievance}:</strong> {currentAssignment.title}<br/>
                <strong>{t.zone}:</strong> Kuppam Town · Ward 1-6
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEscalateModalOpen(false)} className="modal-cancel" style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '12px', background: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>{t.cancel}</button>
              <button onClick={onEscalate} className="modal-confirm-r" style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', background: 'var(--red)', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>{t.yesEscalate}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FOTaskDetail;
