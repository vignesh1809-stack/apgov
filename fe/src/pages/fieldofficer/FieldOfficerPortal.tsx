import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { translations } from '../../i18n/translations';
import type { Assignment } from './types';
import {
  fetchFOAssignments,
  fetchFOStats,
  updateFOAssignmentStatus,
  escalateFOAssignment,
} from '../../store/fieldOfficerSlice';

// Import subcomponents
import FOHome from './pages/FOHome';
import FOAssignments from './pages/FOAssignments';
import FOTaskDetail from './pages/FOTaskDetail';
import FORouteMap from './pages/FORouteMap';
import FOPerformanceStats from './pages/FOPerformanceStats';

const FieldOfficerPortal: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];
  const activeScreen = (searchParams.get('screen') || 'home') as 'home' | 'tasks' | 'detail' | 'map' | 'stats';
  const selectedId = searchParams.get('id');

  React.useEffect(() => {
    dispatch(fetchFOAssignments());
    dispatch(fetchFOStats());
  }, [dispatch]);

  // Modal / overlay states
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Field visit form states
  const [fieldNotes, setFieldNotes] = useState('');
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  // Assignments state (using local state to make changes interactive)
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      stopNum: 1,
      citizenName: 'Ravi Kumar',
      phone: '+91 98765 43210',
      address: 'D.No 3-14, Ward 3, Kuppam Town',
      category: 'Road / Infra',
      title: 'Road collapse blocks path',
      description: 'Large potholes and road collapse near government school entrance.',
      village: 'Kuppam Town',
      ward: 'Ward 3',
      urgency: 'Medium',
      status: 'Resolved',
      time: 'Visited 9:20 AM',
      distance: '0.0 km',
      notes: 'Road requires immediate gravel fill. MLA office notified.',
      photoUploaded: true
    },
    {
      id: '2',
      stopNum: 2,
      citizenName: 'Lakshmi Devi',
      phone: '+91 98765 43211',
      address: 'D.No 4-23, Ward 4, Kuppam Town',
      category: 'Water supply',
      title: 'No water for 5 days',
      description: 'No water supply in the entire locality for 5 consecutive days.',
      village: 'Kuppam Town',
      ward: 'Ward 4',
      urgency: 'High',
      status: 'En route',
      time: 'En route',
      distance: '0.8 km',
    },
    {
      id: '3',
      stopNum: 3,
      citizenName: 'Suresh Babu',
      phone: '+91 98765 43212',
      address: 'D.No 4-56, Ward 4, Kuppam Town',
      category: 'Health',
      title: 'PHC doctor absent',
      description: 'Elderly patient critical and needs assistance. PHC doctor absent.',
      village: 'Kuppam Town',
      ward: 'Ward 4',
      urgency: 'High',
      status: 'Pending',
      time: 'Next stop',
      distance: '1.2 km',
    },
    {
      id: '4',
      stopNum: 4,
      citizenName: 'Anita Reddy',
      phone: '+91 98765 43215',
      address: 'D.No 5-12, Venkatapur',
      category: 'Health',
      title: 'PHC doctor absent — elderly patient critical',
      description: 'PHC doctor has been absent for the past 2 weeks. Elderly patient with diabetes needs urgent attention.',
      village: 'Venkatapur village',
      ward: 'Ward 5',
      urgency: 'High',
      status: 'Pending',
      time: '6 days ago',
      distance: '2.1 km',
    },
    {
      id: '5',
      stopNum: 5,
      citizenName: 'Krishnamurthy',
      phone: '+91 98765 43220',
      address: 'Ramagiri, Ward 2',
      category: 'Road / Infra',
      title: 'Road collapse blocks ambulance route',
      description: 'Main road to hospital has collapsed blocking transit.',
      village: 'Ramagiri village',
      ward: 'Ward 2',
      urgency: 'High',
      status: 'Pending',
      time: '4 days ago',
      distance: '2.8 km',
    },
    {
      id: '6',
      stopNum: 6,
      citizenName: 'Padma Rao',
      phone: '+91 98765 43221',
      address: 'Bethampudi, Ward 6',
      category: 'Education',
      title: 'Mid-day meal delayed 3 days',
      description: 'Government school mid-day meal delayed.',
      village: 'Bethampudi village',
      ward: 'Ward 6',
      urgency: 'Medium',
      status: 'Pending',
      time: '3 days ago',
      distance: '3.4 km',
    },
    {
      id: '7',
      stopNum: 7,
      citizenName: 'Srinivas Rao',
      phone: '+91 98765 43222',
      address: 'Kuppam Town, Ward 1',
      category: 'Civic',
      title: 'Panchayat office gate lock broken',
      description: 'Gate lock is broken and security is compromised.',
      village: 'Kuppam Town',
      ward: 'Ward 1',
      urgency: 'Low',
      status: 'Pending',
      time: '1 day ago',
      distance: '4.1 km',
    },
    {
      id: '8',
      stopNum: 8,
      citizenName: 'Meena Kumari',
      phone: '+91 98765 43223',
      address: 'Nattrampallee, Ward 6',
      category: 'Environment',
      title: 'Fallen tree branch blocking footpath',
      description: 'Large branch blocked pedestrian pathway.',
      village: 'Nattrampallee',
      ward: 'Ward 6',
      urgency: 'Low',
      status: 'Pending',
      time: '1 day ago',
      distance: '5.2 km',
    }
  ]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleScreenChange = (screen: 'home' | 'tasks' | 'detail' | 'map' | 'stats', assignmentId?: string) => {
    const params: Record<string, string> = { screen };
    if (assignmentId !== undefined) {
      params.id = assignmentId;
      // Pre-fill input details if viewing task details
      const selected = assignments.find(a => a.id === assignmentId);
      if (selected) {
        setFieldNotes(selected.notes || '');
        setIsPhotoSelected(selected.photoUploaded || false);
      }
    }
    setSearchParams(params);
    const container = document.getElementById('scroll-area');
    if (container) {
      container.scrollTop = 0;
    }
  };

  const handleMarkVisited = () => {
    if (!selectedId) return;
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === selectedId) {
          return {
            ...a,
            status: 'Resolved',
            time: 'Visited Just now',
            notes: fieldNotes,
            photoUploaded: isPhotoSelected
          };
        }
        return a;
      })
    );
    if (selectedId) {
      // Dispatch status update to Field Officer Microservice Backend API
      dispatch(
        updateFOAssignmentStatus({
          id: selectedId,
          status: 'Resolved',
          fieldNotes: fieldNotes,
        })
      );
    }
    showToast('Marked as visited & resolved');
    handleScreenChange('tasks');
  };

  const handleEscalate = () => {
    if (!selectedId) return;
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === selectedId) {
          return {
            ...a,
            status: 'Pending',
            time: 'Escalated to MLA',
            urgency: 'High',
            notes: fieldNotes + ' [Escalated: Critical action required]',
            photoUploaded: isPhotoSelected
          };
        }
        return a;
      })
    );
    // Dispatch escalation to Field Officer Microservice Backend API
    dispatch(
      escalateFOAssignment({
        id: selectedId,
        reason: 'Critical action required',
        notes: fieldNotes,
      })
    );
    setEscalateModalOpen(false);
    showToast('Escalated to MLA Office');
    handleScreenChange('tasks');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(logout());
    }
  };

  // KPI Computations
  const totalAssigned = assignments.length;
  const resolvedCount = assignments.filter(a => a.status === 'Resolved').length;
  const visitedCount = assignments.filter(a => a.status === 'Visited' || a.status === 'Resolved').length;
  const pendingCount = assignments.filter(a => a.status === 'Pending').length;

  const currentAssignment = assignments.find(a => a.id === selectedId);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        /* Airbnb premium styles and tokens */
        :root {
          --bg: #F5F5F5;
          --surface: #FFFFFF;
          --text1: #1A1A1A;
          --text2: #717171;
          --text3: #B0B0B0;
          --gold: #FFD700;
          --gold-txt: #7A5F00;
          --gold-bg: #FFFBEB;
          --gold-bd: rgba(204,153,0,0.22);
          --red: #E02020;
          --red-bg: #FFF1F0;
          --red-txt: #A80000;
          --red-bd: rgba(224,32,32,0.18);
          --ora: #D97706;
          --ora-bg: #FFFBEB;
          --ora-txt: #92400E;
          --ora-bd: rgba(217,119,6,0.2);
          --grn: #15803D;
          --grn-bg: #F0FDF4;
          --grn-txt: #14532D;
          --grn-bd: rgba(21,128,61,0.18);
          --sh1: 0 1px 2px rgba(0,0,0,0.06);
          --sh2: 0 2px 10px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.06);
          --sh3: 0 8px 28px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.06);
        }

        .hdr { background: var(--surface); padding: 8px 18px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); flex-shrink: 0; }
        .back { display: flex; align-items: center; gap: 7px; cursor: pointer; margin-bottom: 10px; }
        .back i { font-size: 20px; color: var(--text1); }
        .back span { font-size: 13px; font-weight: 600; color: var(--text1); }
        .h-title { font-size: 20px; font-weight: 800; color: var(--text1); letter-spacing: -0.5px; line-height: 1.2; text-align: left; }
        .h-sub { font-size: 12px; color: var(--text2); margin-top: 4px; line-height: 1.5; text-align: left; }
        .chip { display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; padding: 4px 12px; font-size: 11px; font-weight: 700; }
        .chip-gold { background: var(--gold); color: #5A3F00; }
        .chip-outline { background: var(--gold-bg); border: 1px solid var(--gold-bd); color: var(--gold-txt); }
        .chip-ghost { background: rgba(0,0,0,0.05); color: var(--text2); }
        .sec { padding: 16px 18px 10px; display: flex; justify-content: space-between; align-items: center; }
        .sec-l { display: flex; align-items: center; gap: 8px; }
        .sec-bar { width: 3px; height: 15px; background: var(--gold); border-radius: 2px; }
        .sec-ttl { font-size: 10px; font-weight: 800; color: var(--text1); letter-spacing: .7px; text-transform: uppercase; }
        .sec-cnt { font-size: 11px; font-weight: 700; background: var(--gold-bg); color: var(--gold-txt); padding: 3px 10px; border-radius: 999px; border: 1px solid var(--gold-bd); }
        .pp { font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 6px; letter-spacing: 0.2px; flex-shrink: 0; }
        .pp-h { background: var(--red-bg); color: var(--red-txt); border: 1px solid var(--red-bd); }
        .pp-m { background: var(--ora-bg); color: var(--ora-txt); border: 1px solid var(--ora-bd); }
        .pp-l { background: var(--grn-bg); color: var(--grn-txt); border: 1px solid var(--grn-bd); }
        .sp { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; flex-shrink: 0; }
        .sp-done { background: var(--grn-bg); color: var(--grn-txt); }
        .sp-act { background: #FFF8EE; color: var(--ora-txt); }
        .sp-next { background: var(--red-bg); color: var(--red-txt); }
        .tc { margin: 0 18px 10px; border-radius: 16px; background: var(--surface); box-shadow: var(--sh2); overflow: hidden; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); }
        .tc-inner { padding: 13px 14px 13px 18px; position: relative; }
        .tc-row { display: flex; align-items: flex-start; gap: 11px; }
        .tc-ico { width: 40px; height: 40px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tc-ico i { font-size: 20px; }
        .tc-body { flex: 1; min-width: 0; }
        .tc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; margin-bottom: 4px; }
        .tc-title { font-size: 13px; font-weight: 700; color: var(--text1); line-height: 1.35; text-align: left; }
        .tc-village { font-size: 11px; font-weight: 700; color: var(--gold-dk); display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .tc-village i { font-size: 11px; }
        .tc-meta { font-size: 10px; color: var(--text2); margin-top: 3px; text-align: left; }
        .tc-citizen { margin-top: 9px; padding: 9px 11px; background: rgba(0,0,0,0.03); border-radius: 10px; display: flex; align-items: center; gap: 8px; }
        .tc-citizen-av { width: 26px; height: 26px; border-radius: 50%; background: var(--gold-bg); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: var(--gold-txt); flex-shrink: 0; }
        .tc-citizen-name { font-size: 11px; font-weight: 700; color: var(--text1); }
        .tc-citizen-ph { font-size: 10px; color: var(--text2); }
        .tc-call { margin-left: auto; width: 28px; height: 28px; border-radius: 9px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; border: none; }
        .det-citizen { margin: 0 18px 14px; background: var(--surface); border-radius: 16px; box-shadow: var(--sh2); padding: 16px; border: 1px solid rgba(0,0,0,0.05); }
        .det-cit-av { width: 48px; height: 48px; border-radius: 50%; background: var(--gold-bg); border: 2.5px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: var(--gold-txt); flex-shrink: 0; }
        .det-info { margin: 0 18px 14px; background: var(--surface); border-radius: 16px; box-shadow: var(--sh2); padding: 16px; border: 1px solid rgba(0,0,0,0.05); }
        .dir { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid rgba(0,0,0,0.055); }
        .dir:last-child { border-bottom: none; padding-bottom: 0; }
        .dk { font-size: 11px; color: var(--text2); }
        .dv { font-size: 12px; font-weight: 700; color: var(--text1); }
        .tl-item { display: flex; gap: 11px; margin-bottom: 13px; }
        .tl-item:last-child { margin-bottom: 0; }
        .tl-dc { display: flex; flex-direction: column; align-items: center; }
        .tl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
        .tl-ln { width: 2px; flex: 1; background: rgba(0,0,0,0.07); min-height: 16px; margin-top: 4px; }
        .tl-bd { flex: 1; text-align: left; }
        .tl-label { font-size: 12px; font-weight: 700; color: var(--text1); }
        .tl-note { font-size: 11px; color: var(--text2); margin-top: 2px; line-height: 1.45; }
        .tl-time { font-size: 10px; color: var(--text3); margin-top: 3px; }
        .sticky-actions { background: var(--surface); padding: 12px 18px 18px; border-top: 1px solid rgba(0,0,0,0.06); flex-shrink: 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); }
        .act-btn { width: 100%; padding: 14px; border-radius: 14px; font-family: 'Plus Jakarta Sans',sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; margin-bottom: 8px; transition: opacity .15s; }
        .act-btn:last-child { margin-bottom: 0; }
        .act-btn:active { opacity: .85; }
        .pdot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); display: inline-block; vertical-align: middle; animation: beat 1.7s ease infinite; }
        @keyframes beat {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.4; }
        }
      `}</style>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast show" id="toast" style={{ display: 'block' }}>
          {toastMessage}
        </div>
      )}

      {/* RENDER ACTIVE SCREEN */}
      {activeScreen === 'home' && (
        <FOHome
          assignments={assignments}
          totalAssigned={totalAssigned}
          resolvedCount={resolvedCount}
          visitedCount={visitedCount}
          pendingCount={pendingCount}
          onScreenChange={handleScreenChange}
          onSignOut={handleSignOut}
          t={t}
          language={language}
        />
      )}

      {activeScreen === 'tasks' && (
        <FOAssignments
          assignments={assignments}
          totalAssigned={totalAssigned}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}

      {activeScreen === 'detail' && currentAssignment && (
        <FOTaskDetail
          currentAssignment={currentAssignment}
          fieldNotes={fieldNotes}
          setFieldNotes={setFieldNotes}
          isPhotoSelected={isPhotoSelected}
          setIsPhotoSelected={setIsPhotoSelected}
          escalateModalOpen={escalateModalOpen}
          setEscalateModalOpen={setEscalateModalOpen}
          onMarkVisited={handleMarkVisited}
          onEscalate={handleEscalate}
          onScreenChange={handleScreenChange}
          showToast={showToast}
          t={t}
          language={language}
        />
      )}

      {activeScreen === 'map' && (
        <FORouteMap
          assignments={assignments}
          totalAssigned={totalAssigned}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}

      {activeScreen === 'stats' && (
        <FOPerformanceStats
          assignments={assignments}
          resolvedCount={resolvedCount}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}
    </div>
  );
};

export default FieldOfficerPortal;
