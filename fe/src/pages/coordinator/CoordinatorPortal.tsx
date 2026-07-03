import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { toggleNotifications, markNotificationsRead } from '../../store/uiSlice';
import { translations } from '../../i18n/translations';

import type { Issue, FieldOfficer } from './types';
import COHome from './pages/COHome';
import COAssign from './pages/COAssign';
import COSelectFO from './pages/COSelectFO';
import COFieldOfficers from './pages/COFieldOfficers';
import COIssueDetail from './pages/COIssueDetail';
import COReports from './pages/COReports';

const CoordinatorPortal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, showNotifications, language } = useAppSelector((state) => state.ui);
  const t = translations[language];
  const [searchParams, setSearchParams] = useSearchParams();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotifClick = () => {
    dispatch(toggleNotifications());
    if (!showNotifications) {
      dispatch(markNotificationsRead());
    }
  };

  // Internal screens: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports'
  const activeScreen = (searchParams.get('screen') || 'home') as 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports';
  const selectedId = searchParams.get('id');

  // Interactive mock states
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      category: 'Health',
      rawTitle: 'PHC doctor absent — patient critical||Primary Health Centre doctor has been absent. A critical patient in Ward 5 needs urgent medical attention and assistance.||High',
      village: 'Venkatapur village · Ward 5',
      status: 'Pending',
      reporter: 'Anita Reddy',
      phone: '+91 98765 43215',
      date: '6 days ago',
    },
    {
      id: '2',
      category: 'Water supply',
      rawTitle: 'No water 5 days — infant in home||No drinking water supply in Kuppam Town Ward 4 for the past 5 consecutive days. Family with an infant is struggling.||High',
      village: 'Kuppam Town · Ward 4',
      status: 'Pending',
      reporter: 'Lakshmi Devi',
      phone: '+91 98765 43211',
      date: '5 days ago',
    },
    {
      id: '3',
      category: 'Road / Infra',
      rawTitle: 'Road collapse blocks ambulance route||A critical section of the main village road has collapsed in Ramagiri, completely blocking the transit route for ambulances.||High',
      village: 'Ramagiri village · Ward 2',
      status: 'Pending',
      reporter: 'Krishnamurthy',
      phone: '+91 98765 43220',
      date: '4 days ago',
    },
    {
      id: '4',
      category: 'Electricity',
      rawTitle: 'Transformer exploded — no power 3 days||Local distribution transformer exploded near Gudupalli. The entire ward has been without power for 3 days.||High',
      village: 'Gudupalli village · Ward 3',
      status: 'Pending',
      reporter: 'Gopala Rao',
      phone: '+91 98765 43221',
      date: '3 days ago',
    },
    {
      id: '5',
      category: 'Electricity',
      rawTitle: 'Streetlight outage near school gate||Streetlights have failed near the Kuppam Town government school gate, causing safety hazards for children during evening hours.||Medium',
      village: 'Kuppam Town · Ward 3',
      status: 'Pending',
      reporter: 'Ravi Kumar',
      phone: '+91 98765 43222',
      date: '3 days ago',
    },
    {
      id: '6',
      category: 'Education',
      rawTitle: 'Mid-day meal supply delayed 3 days||The government primary school mid-day meal supplies have been delayed for 3 days in Bethampudi.||Medium',
      village: 'Bethampudi village · Ward 6',
      status: 'Pending',
      reporter: 'Padma Rao',
      phone: '+91 98765 43223',
      date: '3 days ago',
    },
    {
      id: '7',
      category: 'Road / Infra',
      rawTitle: 'Garbage not collected for 8 days||Solid waste has accumulated in public bins with no garbage collection for over a week in Gudupalli Ward 1.||Medium',
      village: 'Gudupalli village · Ward 1',
      status: 'Pending',
      reporter: 'Venkat Rao',
      phone: '+91 98765 43224',
      date: '2 days ago',
    },
    {
      id: '8',
      category: 'Road / Infra',
      rawTitle: 'Panchayat gate lock broken||The entrance gate lock of the local Kuppam Town panchayat office is broken. Security risk.||Low',
      village: 'Kuppam Town · Ward 1',
      status: 'Pending',
      reporter: 'Srinivas Rao',
      phone: '+91 98765 43225',
      date: '1 day ago',
    },
    {
      id: '9',
      category: 'Water supply',
      rawTitle: 'Water pipeline leakage main junction||Main drinking water pipeline is leaking at the central junction, causing water wastage and low pressure.||Medium',
      village: 'Kuppam Town · Ward 2',
      status: 'In Progress',
      assignedTo: 'Suresh Reddy',
      reporter: 'Anand Kumar',
      phone: '+91 98765 43201',
      date: '4 days ago',
    },
    {
      id: '10',
      category: 'Road / Infra',
      rawTitle: 'Potholes on temple road||Large potholes along the temple access road are causing minor accidents.||Low',
      village: 'Kuppam Town · Ward 2',
      status: 'Resolved',
      assignedTo: 'Suresh Reddy',
      reporter: 'Kishore Babu',
      phone: '+91 98765 43202',
      date: 'Resolved today',
    }
  ]);

  const [fieldOfficers, setFieldOfficers] = useState<FieldOfficer[]>([
    {
      id: 'FO-KUP-042',
      name: 'Suresh Reddy',
      designation: 'Ward 1–6 · Kuppam Town',
      village: 'Kuppam Town · Ward 4',
      status: 'Available',
      activeTasks: 2,
      resolvedTasks: 5,
      avgCloseTime: '2.1d',
      tasksList: ['Water pipeline leakage main junction', 'Repair of streetlights in Ward 2'],
    },
    {
      id: 'FO-KUP-038',
      name: 'Praveen Murthy',
      designation: 'Ward 1–4 · Kuppam Town',
      village: 'Kuppam Town · Ward 1',
      status: 'Available',
      activeTasks: 4,
      resolvedTasks: 8,
      avgCloseTime: '2.8d',
      tasksList: ['Drainage repair', 'Pothole filling Ward 3', 'Water pipeline check', 'Panchayat cleaning'],
    },
    {
      id: 'FO-KUP-041',
      name: 'Venu Kumar',
      designation: 'Ward 3–6 · Kuppam Town',
      village: 'Kuppam Town · Ward 3',
      status: 'Busy',
      activeTasks: 7,
      resolvedTasks: 12,
      avgCloseTime: '3.2d',
      tasksList: ['School building inspection', 'Substation oil change', 'Drainage overflow main street', 'Road leveling', 'Borewell pump repair', 'Public toilet maintenance', 'Park gate repair'],
    },
    {
      id: 'FO-KUP-040',
      name: 'Govind Rao',
      designation: 'Ward 2–5 · Kuppam Town',
      village: 'Gudupalli village · Ward 3',
      status: 'Busy',
      activeTasks: 6,
      resolvedTasks: 9,
      avgCloseTime: '2.5d',
      tasksList: ['Gudupalli PHC cleaning', 'Transformer fencing', 'High voltage line clearance', 'Panchayat board replacement', 'Streetlights Gudupalli', 'Drainage cleaning Ward 2'],
    },
    {
      id: 'FO-KUP-043',
      name: 'Naresh Kumar',
      designation: 'Ward 4–6 · Kuppam Town',
      village: 'Venkatapur village · Ward 5',
      status: 'Busy',
      activeTasks: 5,
      resolvedTasks: 7,
      avgCloseTime: '2.9d',
      tasksList: ['Venkatapur road repair', 'School drinking water supply', 'PHC doctor attendance register', 'Anganwadi food check', 'Pond desilting'],
    },
    {
      id: 'FO-KUP-039',
      name: 'Ravi Prasad',
      designation: 'Ward 1–6 · Kuppam Town',
      village: 'Ramagiri village · Ward 2',
      status: 'Overloaded',
      activeTasks: 10,
      resolvedTasks: 15,
      avgCloseTime: '3.5d',
      tasksList: ['Ramagiri road block', 'Bridge repair work', 'Drinking water chlorination', 'Streetlight complaints Ward 1', 'Sanitation drive Ramagiri', 'Weed clearing primary school', 'Veterinary clinic water supply', 'High school roof repair', 'Gravel laying Ward 6', 'Community hall electrical check'],
    },
  ]);

  // Interactive UI state overlays
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<Issue | null>(null);
  const [selectedFoId, setSelectedFoId] = useState<string>('');
  const [expandedFoId, setExpandedFoId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleScreenChange = (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => {
    const params: Record<string, string> = { screen };
    if (id !== undefined) {
      params.id = id;
    }
    setSearchParams(params);
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }
  };

  const handleOpenAssignSelect = (issue: Issue) => {
    setSelectedIssueForAssign(issue);
    // Dynamic Pre-selection: Find the lightest available (non-overloaded) officer
    const sortedAvailable = [...fieldOfficers]
      .filter(fo => fo.status !== 'Overloaded')
      .sort((a, b) => a.activeTasks - b.activeTasks);
    setSelectedFoId(sortedAvailable[0]?.id || fieldOfficers[0]?.id || '');
    handleScreenChange('select', issue.id);
  };

  const handleConfirmAssignment = () => {
    if (!selectedIssueForAssign || !selectedFoId) return;

    const targetFo = fieldOfficers.find(fo => fo.id === selectedFoId);
    if (!targetFo) return;

    const parts = selectedIssueForAssign.rawTitle.split('||');
    const issueTitle = parts[0] || selectedIssueForAssign.rawTitle;

    // 1. Update issue state to 'In Progress' and attach assignee
    setIssues(prev =>
      prev.map(i => {
        if (i.id === selectedIssueForAssign.id) {
          return {
            ...i,
            status: 'In Progress',
            assignedTo: targetFo.name,
          };
        }
        return i;
      })
    );

    // 2. Update FO state
    setFieldOfficers(prev =>
      prev.map(fo => {
        if (fo.id === selectedFoId) {
          const newActiveTasks = fo.activeTasks + 1;
          let newStatus: 'Available' | 'Busy' | 'Overloaded' = fo.status;
          if (newActiveTasks >= 8) {
            newStatus = 'Overloaded';
          } else if (newActiveTasks >= 4) {
            newStatus = 'Busy';
          } else {
            newStatus = 'Available';
          }
          return {
            ...fo,
            activeTasks: newActiveTasks,
            status: newStatus,
            tasksList: [...fo.tasksList, issueTitle],
          };
        }
        return fo;
      })
    );

    setIsConfirmModalOpen(false);
    showToast(language === 'te' ? `సమస్య ${targetFo.name} కి కేటాయించబడింది ✓` : `Issue assigned to ${targetFo.name} ✓`);

    // Redirect to Assign Issues screen after toast disappears
    setTimeout(() => {
      handleScreenChange('assign');
      setSelectedIssueForAssign(null);
    }, 2200);
  };

  const handleSignOut = () => {
    if (window.confirm(t.confirmSignOut)) {
      dispatch(logout());
    }
  };

  // Dynamic calculations based on state
  const unassignedIssues = issues.filter(i => i.status === 'Pending');
  const inProgressIssues = issues.filter(i => i.status === 'In Progress');
  const resolvedIssues = issues.filter(i => i.status === 'Resolved');
  const currentIssue = selectedId ? issues.find(i => i.id === selectedId) : null;

  const rawUserName = user?.name || 'Venkata Rao';
  const userName = language === 'te' && rawUserName === 'Venkata Rao' ? 'వెంకట రావు' : rawUserName;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F5F5' }}>
      <style>{`
        /* Scoped Premium Styling based on HTML Coordinator Template */
        :root {
          --gold: #FFD700;
          --gd: #CC9900;
          --gdp: #996600;
          --gbg: #fffde7;
          --gbd: rgba(255,215,0,0.3);
          --w: #fff;
          --surf: #f5f5f5;
          --brd: #f0f0f0;
          --t1: #1a1a1a;
          --t2: #717171;
          --t3: #b0b0b0;
          --grn: #15803d;
          --gbg2: #f0fdf4;
          --gbd2: #bbf7d0;
          --gt: #14532d;
          --red: #e02020;
          --rbg: #fff1f0;
          --rbd: #fecaca;
          --rt: #a80000;
          --ora: #d97706;
          --obg: #fffbeb;
          --obd: #fed7aa;
          --ot: #92400e;
          --sh: 0 2px 10px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.05);

          /* Styles specifically for existing KPI Cards design */
          --gold-bg-light: #fffde7;
          --gold-primary: #FFD700;
          --gold-dark: #CC9900;
          --gold-deep: #996600;
          --gold-txt: #663300;
          --gold-border: rgba(204,153,0,0.25);
          --card-shadow: 0 4px 16px rgba(153, 102, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .scrl {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .scrl::-webkit-scrollbar {
          display: none;
        }

        /* Topbar & Headers */
        .topbar {
          background: var(--w);
          padding: 12px 18px 13px;
          border-bottom: 1px solid var(--brd);
          flex-shrink: 0;
          text-align: left;
        }
        .trow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .greet {
          font-size: 11px;
          color: var(--t3);
          font-weight: 500;
        }
        .uname {
          font-size: 17px;
          font-weight: 800;
          color: var(--t1);
          letter-spacing: -0.3px;
          margin-top: 2px;
        }
        .nbell {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gbg);
          border: 1.5px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .nbell i {
          font-size: 19px;
          color: var(--gd);
          animation: wag 4s ease 1.5s infinite;
        }
        .nbdg {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: var(--red);
          border-radius: 50%;
          border: 2px solid var(--w);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 800;
          color: #fff;
        }
        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--gold);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 800;
          color: #5a3f00;
        }
        .mc {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--gbg);
          border: 1px solid var(--gbd);
          border-radius: 8px;
          padding: 3px 10px;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 700;
          color: var(--gdp);
        }
        .mc i {
          font-size: 11px;
        }

        .hdr {
          background: var(--w);
          padding: 12px 18px 13px;
          border-bottom: 1px solid var(--brd);
          flex-shrink: 0;
          text-align: left;
        }
        .back {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .back i {
          font-size: 21px;
          color: var(--t1);
        }
        .back span {
          font-size: 13px;
          font-weight: 700;
          color: var(--t1);
        }
        .ptitle {
          font-size: 20px;
          font-weight: 800;
          color: var(--t1);
          letter-spacing: -0.4px;
        }
        .psub {
          font-size: 12px;
          color: var(--t2);
          margin-top: 3px;
        }

        /* Chips */
        .chip-row {
          display: flex;
          gap: 7px;
          padding: 10px 14px 8px;
          overflow-x: auto;
          flex-shrink: 0;
          background: var(--w);
          border-bottom: 1px solid var(--brd);
        }
        .chip-row::-webkit-scrollbar {
          display: none;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        /* Sections */
        .sec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px 7px;
        }
        .sec-l {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .sec-bar {
          width: 3px;
          height: 15px;
          border-radius: 0;
        }
        .sec-ttl {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sec-cnt {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .pdot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red);
          display: inline-block;
          animation: beat 1.7s ease infinite;
        }

        /* Issue Cards */
        .ic {
          margin: 0 14px 8px;
          background: var(--w);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--sh);
          border: 1px solid rgba(0,0,0,0.03);
          text-align: left;
        }
        .ia {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
        }
        .ic-body {
          padding: 13px 13px 0 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .ic-ico {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ic-ico i {
          font-size: 19px;
        }
        .ic-txt {
          flex: 1;
          min-width: 0;
        }
        .ic-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 5px;
        }
        .ic-ttl {
          font-size: 12px;
          font-weight: 700;
          color: var(--t1);
          line-height: 1.35;
        }
        .pp {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .ic-vil {
          font-size: 11px;
          font-weight: 700;
          color: var(--gd);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ic-vil i {
          font-size: 11px;
        }
        .ic-av {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 4px;
        }
        .av-sm {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--gbg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          color: var(--gdp);
        }
        .ic-meta {
          font-size: 10px;
          color: var(--t3);
        }
        .ic-foot {
          padding: 10px 13px 13px 18px;
        }
        .abtn {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.15s;
        }
        .abtn:active {
          opacity: 0.85;
        }
        .abtn i {
          font-size: 14px;
        }

        /* Field Officer Cards */
        .fo-card {
          background: var(--w);
          border-radius: 16px;
          padding: 13px 14px;
          box-shadow: var(--sh);
          border: 1px solid rgba(0,0,0,0.03);
          text-align: left;
        }
        .fo-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .fo-av {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .fo-name {
          font-size: 13px;
          font-weight: 800;
          color: var(--t1);
        }
        .fo-id {
          font-size: 10px;
          color: var(--t3);
          margin-top: 1px;
        }
        .fo-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 6px;
          margin-left: auto;
        }
        .fo-stats {
          display: flex;
          gap: 7px;
          margin-bottom: 10px;
        }
        .fo-stat {
          flex: 1;
          background: var(--surf);
          border-radius: 10px;
          padding: 7px 6px;
          text-align: center;
        }
        .fo-stat-n {
          font-size: 16px;
          font-weight: 800;
          line-height: 1;
        }
        .fo-stat-l {
          font-size: 9px;
          color: var(--t3);
          margin-top: 2px;
        }
        .wbar-track {
          height: 5px;
          background: var(--surf);
          border-radius: 3px;
          overflow: hidden;
        }
        .wbar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease-in-out;
        }
        .wcap {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }
        .wcap span {
          font-size: 10px;
          color: var(--t3);
        }

        /* Toast Alert */
        .toast {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(21, 128, 61, 0.94);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 20px;
          white-space: nowrap;
          z-index: 200;
          box-shadow: 0 4px 20px rgba(21, 128, 61, 0.3);
          animation: fu 0.3s ease;
        }

        /* Modals and Overlays */
        .modal-ov {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 100;
          display: flex;
          align-items: flex-end;
        }
        .modal-sheet {
          background: var(--w);
          border-radius: 24px 24px 0 0;
          padding: 20px 20px 30px;
          width: 100%;
          animation: slideUpModal 0.25s ease-out;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
        }
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .mh {
          width: 36px;
          height: 4px;
          border-radius: 2px;
          background: #ddd;
          margin: 0 auto 16px;
        }
        .modal-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--t1);
        }
        .modal-sub {
          font-size: 12px;
          color: var(--t2);
          line-height: 1.55;
          margin-bottom: 16px;
          text-align: left;
        }
        .modal-actions {
          display: flex;
          gap: 9px;
        }
        .mcl {
          flex: 1;
          padding: 13px;
          background: #f4f4f4;
          border: none;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--t2);
          cursor: pointer;
        }
        .mco {
          flex: 1;
          padding: 13px;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          border: none;
        }

        /* Scoped styles for original KPI cards */
        .co-kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 14px;
        }
        .co-kpi-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.04);
          border-radius: 16px;
          padding: 12px 14px;
          box-shadow: var(--card-shadow);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: left;
        }
        .co-kpi-card:active {
          transform: scale(0.98);
        }
        .co-kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .co-kpi-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .co-kpi-num {
          font-size: 24px;
          font-weight: 800;
          color: #111;
          margin-top: 8px;
        }
        .co-kpi-lbl {
          font-size: 11px;
          font-weight: 600;
          color: #777;
          margin-top: 2px;
        }
        .badge {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .badge-red {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }
        .badge-orange {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid rgba(245, 158, 11, 0.15);
        }
        .badge-green {
          background: #D1FAE5;
          color: #065F46;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        /* Scoped Timelines */
        .timeline-box {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: var(--sh);
          padding: 14px 16px;
          margin: 0 14px 14px;
          text-align: left;
        }
        .timeline-step {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
        }
        .timeline-step:last-child {
          margin-bottom: 0;
        }
        .timeline-icon-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #E2E8F0;
        }
        .timeline-dot.completed {
          background: var(--gold-primary);
        }
        .timeline-dot.active {
          background: var(--gold-dark);
          box-shadow: 0 0 0 3px var(--gold-bg-light);
        }
        .timeline-line {
          width: 2px;
          flex: 1;
          background: #E2E8F0;
          margin-top: 4px;
        }
        .timeline-content {
          flex: 1;
        }
        .timeline-title {
          font-size: 12px;
          font-weight: 800;
          color: #111;
        }
        .timeline-time {
          font-size: 9px;
          color: #999;
          margin-top: 2px;
        }
        .timeline-desc {
          font-size: 11px;
          color: #666;
          margin-top: 3px;
          line-height: 1.4;
        }

        /* Sheet drawer backdrop */
        .sheet-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          display: flex;
          align-items: flex-end;
          animation: fadeIn 0.2s ease-out;
        }
        .sheet-container {
          background: #w;
          border-radius: 24px 24px 0 0;
          padding: 20px 18px 28px;
          width: 100%;
          max-height: 80%;
          overflow-y: auto;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }
        
        @keyframes fu {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes wag {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(12deg); }
          40% { transform: rotate(-9deg); }
          60% { transform: rotate(6deg); }
          80% { transform: rotate(-3deg); }
        }
      `}</style>

      {/* ── TOAST ALERT SYSTEM ── */}
      {toastMessage && (
        <div className="toast show" style={{ background: toastMessage.includes('✓') ? 'rgba(21, 128, 61, 0.94)' : 'rgba(26, 26, 26, 0.96)' }}>
          {toastMessage}
        </div>
      )}

      {/* ═══════════ S2: HOME DASHBOARD ═══════════ */}
      {activeScreen === 'home' && (
        <COHome
          userName={userName}
          unreadCount={unreadCount}
          unassignedIssues={unassignedIssues}
          inProgressIssues={inProgressIssues}
          resolvedIssues={resolvedIssues}
          fieldOfficers={fieldOfficers}
          onScreenChange={handleScreenChange}
          onOpenAssignSelect={handleOpenAssignSelect}
          onNotifClick={handleNotifClick}
          onSignOut={handleSignOut}
          t={t}
          language={language}
        />
      )}

      {/* ═══════════ S3: ASSIGN ISSUES ═══════════ */}
      {activeScreen === 'assign' && (
        <COAssign
          unassignedIssues={unassignedIssues}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onScreenChange={handleScreenChange}
          onOpenAssignSelect={handleOpenAssignSelect}
          t={t}
          language={language}
        />
      )}

      {/* ═══════════ S4: SELECT FIELD OFFICER ═══════════ */}
      {activeScreen === 'select' && selectedIssueForAssign && (
        <COSelectFO
          selectedIssueForAssign={selectedIssueForAssign}
          fieldOfficers={fieldOfficers}
          selectedFoId={selectedFoId}
          setSelectedFoId={setSelectedFoId}
          isConfirmModalOpen={isConfirmModalOpen}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          onConfirmAssignment={handleConfirmAssignment}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}

      {/* ═══════════ S5: FIELD OFFICERS OVERVIEW ═══════════ */}
      {activeScreen === 'fos' && (
        <COFieldOfficers
          fieldOfficers={fieldOfficers}
          expandedFoId={expandedFoId}
          setExpandedFoId={setExpandedFoId}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}

      {/* ═══════════ S6: GRIEVANCE DETAIL VIEW ═══════════ */}
      {activeScreen === 'detail' && currentIssue && (
        <COIssueDetail
          currentIssue={currentIssue}
          userName={userName}
          onScreenChange={handleScreenChange}
          onOpenAssignSelect={handleOpenAssignSelect}
          t={t}
          language={language}
        />
      )}

      {/* ── 6. MANDAL REPORTS SCREEN ── */}
      {activeScreen === 'reports' && (
        <COReports
          resolvedIssues={resolvedIssues}
          issues={issues}
          unassignedIssues={unassignedIssues}
          fieldOfficers={fieldOfficers}
          onScreenChange={handleScreenChange}
          t={t}
          language={language}
        />
      )}
    </div>
  );
};

export default CoordinatorPortal;
