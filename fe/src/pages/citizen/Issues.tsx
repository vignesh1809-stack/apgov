import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { addIssue, updateIssueStatus, updateIssueDetails, type Issue } from '../../store/issuesSlice';
import { addNotification, setNewIssueModalOpen } from '../../store/uiSlice';
import { translations } from '../../i18n/translations';

import {
  fetchCitizenGrievances,
  createCitizenGrievance,
  withdrawCitizenGrievance,
  fetchVillagesList,
} from '../../store/citizenSlice';
import { compressImage } from '../../utils/imageCompressor';

const parseIssueTitle = (title: string) => {
  const parts = title.split('||');
  if (parts.length >= 2) {
    return {
      title: parts[0],
      description: parts[1],
      urgency: (parts[2] || 'Medium') as 'Low' | 'Medium' | 'High'
    };
  }
  return {
    title: title,
    description: '',
    urgency: 'Medium' as const
  };
};

const Issues: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: issues } = useAppSelector((state) => state.issues);
  const { newIssueModalOpen } = useAppSelector((state) => state.ui);
  const { language } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const t = translations[language];

  React.useEffect(() => {
    dispatch(fetchCitizenGrievances());
    dispatch(fetchVillagesList());
  }, [dispatch]);

  const [selectedMlaIssueId, setSelectedMlaIssueId] = React.useState<string | null>(null);
  const [mlaAssignedOfficer, setMlaAssignedOfficer] = React.useState('');
  const [mlaResolutionNote, setMlaResolutionNote] = React.useState('');
  const [mlaComments, setMlaComments] = React.useState<{ id: string; name: string; text: string; time: string }[]>([]);
  const [newMlaCommentText, setNewMlaCommentText] = React.useState('');

  React.useEffect(() => {
    if (selectedMlaIssueId) {
      const savedOfficer = localStorage.getItem(`apgov_issue_assignment_${selectedMlaIssueId}`) || '';
      const savedResNote = localStorage.getItem(`apgov_issue_resnote_${selectedMlaIssueId}`) || '';
      setMlaAssignedOfficer(savedOfficer);
      setMlaResolutionNote(savedResNote);
      
      const savedComments = localStorage.getItem(`apgov_issue_comments_${selectedMlaIssueId}`);
      if (savedComments) {
        setMlaComments(JSON.parse(savedComments));
      } else {
        const defaultComments = [
          { id: '1', name: 'Ravi Kumar (Citizen)', text: 'Causing major traffic issues during morning hours. Please address on priority.', time: '2 days ago' },
          { id: '2', name: 'MLA Office Team', text: 'Grievance received. Assigning to the respective field officer for inspection.', time: '1 day ago' }
        ];
        setMlaComments(defaultComments);
        localStorage.setItem(`apgov_issue_comments_${selectedMlaIssueId}`, JSON.stringify(defaultComments));
      }
    }
  }, [selectedMlaIssueId]);

  React.useEffect(() => {
    if (user?.role === 'citizen') {
      const parsedVillage = user.designation?.split(' · ')[1];
      if (parsedVillage) {
        setNewVillage(parsedVillage);
      }
    }
  }, [user]);

  const [searchParams, setSearchParams] = useSearchParams();
  const villageFilter = searchParams.get('village');

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Review' | 'Resolved'>('All');
  
  // Issue Editor states
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);

  // Citizen inline editor states
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUrgency, setEditUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // New Issue form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Road / Infra');
  const [newVillage, setNewVillage] = useState('Kuppam');
  const [newReporter, setNewReporter] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [newUrgency, setNewUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  // Track page states
  const [trackChip, setTrackChip] = useState<'All' | 'Pending' | 'In Review' | 'Resolved' | 'Withdrawn'>('All');

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, { maxWidth: 1280, quality: 0.8 });
        setNewImage(compressed.dataUrl);
        setCompressionInfo(`${compressed.sizeReductionPercent}% ${language === 'te' ? 'తగ్గించబడింది' : 'compressed'}`);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'te' ? 'మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వదు' : 'Voice input is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewDesc((prev) => (prev ? prev + ' ' + transcript : transcript));
        if (!newTitle) {
          setNewTitle(transcript.slice(0, 50));
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert(language === 'te' ? 'GPS స్థాన సేవ అందుబాటులో లేదు' : 'GPS location is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setNewVillage('Kuppam');
        alert(language === 'te' ? 'GPS ద్వారా మీ నివాస గ్రామం గుర్తించబడింది: కుప్పం' : 'GPS verified your location: Kuppam Town');
      },
      () => {
        alert(language === 'te' ? 'GPS స్థానాన్ని గుర్తించలేకపోయాము' : 'Could not detect GPS location. Using default village.');
      }
    );
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Road / Infra':
        return { bg: '#fffde7', color: '#CC9900', icon: 'ti ti-road' };
      case 'Water supply':
        return { bg: '#eff6ff', color: '#3b82f6', icon: 'ti ti-droplet' };
      case 'Electricity':
        return { bg: '#fefce8', color: '#eab308', icon: 'ti ti-bolt' };
      case 'Health':
        return { bg: '#fef2f2', color: 'var(--red)', icon: 'ti ti-first-aid-kit' };
      case 'Education':
        return { bg: '#f0fdf4', color: 'var(--green)', icon: 'ti ti-school' };
      default:
        return { bg: '#f5f3ff', color: 'var(--purple)', icon: 'ti ti-user' };
    }
  };

  const getStatusStyle = (status: Issue['status']) => {
    switch (status) {
      case 'Resolved':
        return { background: 'var(--green-bg)', color: 'var(--green-text)' };
      case 'In Review':
        return { background: '#fffde7', color: 'var(--gold-deep)' };
      default:
        return { background: 'var(--red-bg)', color: 'var(--red-text)' };
    }
  };

  const getTranslatedVillageName = (name: string) => {
    if (name === 'Kuppam') return t.kuppam;
    if (name === 'Ramagiri') return t.ramagiri;
    if (name === 'Gudupalli') return t.gudupalli;
    if (name === 'Venkatapur') return t.venkatapur;
    if (name === 'Bethampudi') return t.bethampudi;
    return name;
  };

  const getTranslatedCategoryName = (category: string) => {
    switch (category) {
      case 'Road / Infra': return t.roadInfra;
      case 'Water supply': return t.waterSupply;
      case 'Electricity': return t.electricity;
      case 'Health': return t.health;
      case 'Education': return t.education;
      case 'Personal': return t.personal;
      default: return category;
    }
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesVillage = !villageFilter || issue.village === villageFilter;
    return matchesStatus && matchesVillage;
  });

  const handleCreateIssue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const reporterName = user?.role === 'citizen' ? (user?.name || 'Ravi Kumar') : newReporter;
    const villageName = user?.role === 'citizen' ? (newVillage || 'Kuppam') : newVillage;

    if (!newTitle.trim() || !reporterName.trim()) {
      alert(t.fillAllFields);
      return;
    }

    // Add the issue to local state
    dispatch(
      addIssue({
        title: newDesc.trim() ? `${newTitle.trim()}||${newDesc.trim()}||${newUrgency}` : `${newTitle.trim()}||||${newUrgency}`,
        category: newCategory,
        village: villageName,
        status: 'Pending',
        reporter: reporterName,
        image: newImage,
      })
    );

    // Persist to Citizen Microservice Backend API
    dispatch(
      createCitizenGrievance({
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        villageName: villageName,
        urgency: newUrgency,
        image: newImage,
      })
    );

    // Trigger a live notification
    dispatch(
      addNotification({
        title: 'New Issue Raised',
        description: `${reporterName} raised an issue: "${newTitle}" in ${villageName}.`,
      })
    );

    // Reset and close
    setNewTitle('');
    setNewDesc('');
    setNewReporter('');
    setNewImage(undefined);
    setNewUrgency('Medium');
    dispatch(setNewIssueModalOpen(false));
    setStatusFilter('All');
    setSelectedIssueId(null);
    setSearchParams({ tab: 'my' });
  };

  const handleUpdateStatus = (id: string, newStatus: Issue['status']) => {
    dispatch(updateIssueStatus({ id, status: newStatus }));
    
    // Add notification about status update
    const issue = issues.find(i => i.id === id);
    if (issue) {
      dispatch(addNotification({
        title: `Issue ${newStatus}`,
        description: `"${issue.title.split('||')[0]}" is now ${newStatus}.`,
      }));
    }
    
    setEditingIssueId(null);
  };

  const clearVillageFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('village');
    setSearchParams(params);
  };

  if (user?.role === 'citizen') {
    const citizenIssues = issues.filter(i => i.reporter === user.name);
    const activeTab = searchParams.get('tab') || 'my';

    const getTrackStatusStyle = (status: Issue['status']) => {
      switch (status) {
        case 'Resolved':
          return {
            cardClass: 'track-card',
            icoBg: 'rgba(187,247,208,0.5)',
            icoColor: '#16a34a',
            pillBg: 'rgba(187,247,208,0.6)',
            pillColor: '#166534'
          };
        case 'In Review':
          return {
            cardClass: 'track-card',
            icoBg: 'rgba(255,215,0,0.2)',
            icoColor: '#CC9900',
            pillBg: 'rgba(255,215,0,0.25)',
            pillColor: '#996600'
          };
        default:
          return {
            cardClass: 'track-card',
            icoBg: 'rgba(254,202,202,0.5)',
            icoColor: '#dc2626',
            pillBg: 'rgba(254,202,202,0.6)',
            pillColor: '#991b1b'
          };
      }
    };

    const renderStepper = (status: Issue['status']) => {
      const steps = [
        { label: t.stepRaised, icon: 'ti ti-check' },
        { label: t.stepNoted, icon: 'ti ti-eye' },
        { label: t.stepWorking, icon: 'ti ti-tool' },
        { label: t.stepDone, icon: 'ti ti-circle-check' }
      ];

      let nodeStates: ('done' | 'active' | 'todo')[] = [];
      let lineStates: ('done' | 'active' | 'todo')[] = [];

      if (status === 'Resolved') {
        nodeStates = ['done', 'done', 'done', 'done'];
        lineStates = ['done', 'done', 'done'];
      } else if (status === 'In Review') {
        nodeStates = ['done', 'done', 'active', 'todo'];
        lineStates = ['done', 'active', 'todo'];
      } else {
        // Pending
        nodeStates = ['done', 'todo', 'todo', 'todo'];
        lineStates = ['todo', 'todo', 'todo'];
      }

      return (
        <div className="stepper">
          {steps.map((step, index) => {
            const nodeState = nodeStates[index];
            const isLast = index === steps.length - 1;
            const lineState = lineStates[index];

            return (
              <React.Fragment key={index}>
                <div className="step-node">
                  <div className={`step-circle ${nodeState}`}>
                    <i className={step.icon} aria-hidden="true"></i>
                  </div>
                  <div className={`step-lbl ${nodeState}`}>{step.label}</div>
                </div>
                {!isLast && <div className={`step-line ${lineState}`}></div>}
              </React.Fragment>
            );
          })}
        </div>
      );
    };

    const filteredTrackIssues = citizenIssues.filter((issue) => {
      return trackChip === 'All' || issue.status === trackChip;
    });

    // Detailed View Screen
    if (selectedIssueId) {
      const selectedIssue = issues.find(i => i.id === selectedIssueId);
      if (selectedIssue) {
        const parsed = parseIssueTitle(selectedIssue.title);
        return (
          <div id="page-citizen-issue-detail" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            <div className="detail-header" style={{ margin: '0 -14px' }}>
              <div className="det-back" onClick={() => setSelectedIssueId(null)}>
                <i className="ti ti-arrow-left" aria-hidden="true"></i>
                <span>{t.backBtn}</span>
              </div>
              <div className="det-title">{parsed.title}</div>
              <div className="det-row">
                <span className="status-pill" style={getStatusStyle(selectedIssue.status)}>
                  {selectedIssue.status === 'Resolved' ? t.resolvedStatus : selectedIssue.status === 'In Review' ? t.inReviewStatus : t.pendingStatus}
                  {selectedIssue.status === 'Resolved' ? ' ✓' : ''}
                </span>
                <span style={{ fontSize: '10px', color: '#bbb' }}>Issue #KUP-2026-{selectedIssue.id.padStart(4, '0')}</span>
              </div>
            </div>

            {/* Banner Image */}
            <div className="det-img">
              {selectedIssue.image ? (
                <img src={selectedIssue.image} alt={parsed.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="det-img-inner">
                  <i className="ti ti-photo" aria-hidden="true"></i>
                  <span>{t.photoEvidenceLabel}</span>
                  <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>{getTranslatedCategoryName(selectedIssue.category)} · {getTranslatedVillageName(selectedIssue.village)}</div>
                </div>
              )}
            </div>

            {/* Description & Information */}
            <div className="det-info glass" style={{ margin: '8px 14px' }}>
              <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {parsed.description || parsed.title}
              </div>
              <div className="det-info-row">
                <span className="det-key">{t.categoryLabel}</span>
                <span className="det-val">{getTranslatedCategoryName(selectedIssue.category)}</span>
              </div>
              <div className="det-info-row">
                <span className="det-key">{t.urgencyLabel}</span>
                <span className="det-val" style={{ color: parsed.urgency === 'High' ? '#dc2626' : parsed.urgency === 'Medium' ? '#CC9900' : '#16a34a' }}>
                  {language === 'te' ? (parsed.urgency === 'High' ? t.highLabel : parsed.urgency === 'Medium' ? t.mediumLabel : t.lowLabel) : parsed.urgency}
                </span>
              </div>
              <div className="det-info-row">
                <span className="det-key">{t.locationLabel}</span>
                <span className="det-val">{getTranslatedVillageName(selectedIssue.village)} Town</span>
              </div>
              <div className="det-info-row">
                <span className="det-key">{t.raisedOnLabel}</span>
                <span className="det-val">{selectedIssue.status === 'Resolved' ? '12 Jun 2025' : selectedIssue.date.includes('Raised') ? selectedIssue.date.replace('Raised ', '') : '12 Jun 2025'}</span>
              </div>
              {selectedIssue.status === 'Resolved' && (
                <div className="det-info-row">
                  <span className="det-key">{t.resolvedOnLabel}</span>
                  <span className="det-val" style={{ color: '#16a34a' }}>{selectedIssue.date.includes('Resolved') ? selectedIssue.date.replace('Resolved ', '') : '14 Jun 2025'}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{ padding: '0 14px', marginBottom: '8px', fontSize: '10px', fontWeight: '700', color: '#bbb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {t.issueTimeline}
            </div>
            <div className="timeline glass" style={{ margin: '0 14px 8px' }}>
              <div className="tl-item">
                <div className="tl-dot-col">
                  <div className="tl-dot" style={{ background: '#16a34a' }}></div>
                  <div className="tl-line"></div>
                </div>
                <div className="tl-body">
                  <div className="tl-label">{t.issueRaisedStatus}</div>
                  <div className="tl-note">{language === 'te' ? `${selectedIssue.reporter} చే ఫోటో సాక్ష్యంతో సమర్పించబడింది` : `Submitted by ${selectedIssue.reporter} with photo evidence`}</div>
                  <div className="tl-time">{selectedIssue.status === 'Resolved' ? '12 Jun 2025 · 10:32 AM' : selectedIssue.date}</div>
                </div>
              </div>

              {(selectedIssue.status === 'In Review' || selectedIssue.status === 'Resolved') && (
                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: '#CC9900' }}></div>
                    <div className="tl-line"></div>
                  </div>
                  <div className="tl-body">
                    <div className="tl-label">{t.acknowledgedStatus}</div>
                    <div className="tl-note">{t.timelineAckDesc}</div>
                    <div className="tl-time">12 Jun 2025 · 2:15 PM</div>
                  </div>
                </div>
              )}

              {(selectedIssue.status === 'In Review' || selectedIssue.status === 'Resolved') && (
                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: '#7c3aed' }}></div>
                    {selectedIssue.status === 'Resolved' && <div className="tl-line"></div>}
                  </div>
                  <div className="tl-body">
                    <div className="tl-label">{t.inProgressStatus}</div>
                    <div className="tl-note">{t.timelineProgDesc}</div>
                    <div className="tl-time">13 Jun 2025 · 9:00 AM</div>
                  </div>
                </div>
              )}

              {selectedIssue.status === 'Resolved' && (
                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: '#16a34a' }}></div>
                  </div>
                  <div className="tl-body">
                    <div className="tl-label" style={{ color: '#16a34a' }}>{t.resolvedStatus} ✓</div>
                    <div className="tl-note">{t.timelineResDesc}</div>
                    <div className="tl-time">{selectedIssue.date.includes('Resolved') ? selectedIssue.date.replace('Resolved ', '') : '14 Jun 2025 · 4:45 PM'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Resolution Note from MLA */}
            {selectedIssue.status === 'Resolved' && (
              <>
                <div style={{ padding: '0 14px', marginBottom: '8px', fontSize: '10px', fontWeight: '700', color: '#bbb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  {t.resolutionNote}
                </div>
                <div className="resolved-box glass-green" style={{ margin: '0 14px 10px' }}>
                  <div className="res-av">CB</div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#166534' }}>
                      {language === 'te' ? 'శ్రీ చంద్రబాబు నాయుడు · ఎమ్మెల్యే కుప్పం' : 'Sri Chandrababu Naidu · MLA Kuppam'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '3px', lineHeight: '1.5' }}>
                      {language === 'te'
                        ? `"మరమ్మత్తులు విజయవంతంగా పూర్తి చేయబడ్డాయి. సమస్య పరిష్కారమైనందుకు ధన్యవాదాలు."`
                        : `"Faulty equipment has been replaced and verified. The area is now fully functional. Thank you for raising this."`}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '5px' }}>14 Jun 2025 · 5:00 PM</div>
                  </div>
                </div>
              </>
            )}

            {/* Withdraw Button */}
            <div style={{ margin: '0 14px 8px' }}>
              <button 
                onClick={() => {
                  if (selectedIssue.status !== 'Resolved') {
                    handleUpdateStatus(selectedIssue.id, 'Resolved');
                  }
                  dispatch(withdrawCitizenGrievance(selectedIssue.id));
                  alert(language === 'te' ? 'సమస్య విజయవంతంగా ఉపసంహరించుకోబడింది!' : 'Grievance marked as withdrawn successfully!');
                  setSelectedIssueId(null);
                }}
                style={{ width: '100%', background: 'rgba(240,253,244,0.9)', border: '1.5px solid #bbf7d0', borderRadius: '14px', padding: '13px', fontSize: '13px', fontWeight: '700', color: '#166534', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', backdropFilter: 'blur(10px)' }}
              >
                <i className="ti ti-circle-check" aria-hidden="true"></i>
                {t.markAsWithdrawnBtn}
              </button>
            </div>
          </div>
        );
      }
    }

    // Dynamic stats strip
    const baseTotal = 300;
    const baseResolved = 278;
    
    const dynamicTotal = baseTotal + issues.length;
    const dynamicResolved = baseResolved + issues.filter((i) => i.status === 'Resolved').length;
    const dynamicRateFloat = ((dynamicResolved / dynamicTotal) * 100).toFixed(1);

    return (
      <div id="page-citizen-issues" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        {activeTab === 'raise' ? (
          <>
            <div className="raise-header" style={{ margin: '0 -14px' }}>
              <div className="raise-back" onClick={() => navigate('/dashboard')}>
                <i className="ti ti-arrow-left" aria-hidden="true"></i>
                <span>{t.backBtn}</span>
              </div>
              <div className="raise-title">{t.navRaiseIssue}</div>
              <div className="raise-sub">
                {language === 'te' ? 'సమస్య నమోదు చేయండి · మీ ఎమ్మెల్యే దీనిని చూస్తారు' : 'సమస్య నమోదు చేయండి · Your MLA will see this'}
              </div>
            </div>

            <div className="scroll" style={{ paddingTop: '4px', paddingBottom: '16px' }}>
              <div className="form-card glass">
                <div className="flbl">{t.categoryLabel}</div>
                <div className="cat-grid">
                  {[
                    { key: 'Road / Infra', icon: 'ti ti-road', label: language === 'te' ? 'రహదారి' : 'Road' },
                    { key: 'Water supply', icon: 'ti ti-droplet', label: language === 'te' ? 'నీరు' : 'Water' },
                    { key: 'Electricity', icon: 'ti ti-bolt', label: language === 'te' ? 'విద్యుత్' : 'Electricity' },
                    { key: 'Health', icon: 'ti ti-first-aid-kit', label: language === 'te' ? 'ఆరోగ్యం' : 'Health' },
                    { key: 'Education', icon: 'ti ti-school', label: language === 'te' ? 'విద్య' : 'Education' },
                    { key: 'Personal', icon: 'ti ti-user', label: language === 'te' ? 'వ్యక్తిగతం' : 'Personal' }
                  ].map((cat) => (
                    <div 
                      key={cat.key} 
                      className={`cat-btn ${newCategory === cat.key ? 'sel' : ''}`}
                      onClick={() => setNewCategory(cat.key)}
                    >
                      <i className={cat.icon} aria-hidden="true"></i>
                      <span>{cat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flbl">{t.issueTitleLabel}</div>
                <input 
                  className="finput" 
                  placeholder={t.issueDescPlaceholder} 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flbl">{t.descriptionLabel}</div>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    style={{
                      border: '1px solid var(--gold)',
                      background: isListening ? '#fef2f2' : '#fffde7',
                      color: isListening ? '#dc2626' : '#996600',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <i className={isListening ? "ti ti-microphone-2" : "ti ti-microphone"} aria-hidden="true" style={{ fontSize: '13px' }}></i>
                    {isListening ? (language === 'te' ? 'వింటున్నారు...' : 'Listening...') : (language === 'te' ? 'వాయిస్ టైపింగ్ 🎙️' : 'Voice Input 🎙️')}
                  </button>
                </div>
                <textarea 
                  className="finput" 
                  rows={3} 
                  placeholder={language === 'te' ? 'సమస్యను వివరంగా వివరించండి లేదా వాయిస్ రికార్డ్ చేయండి...' : 'Describe the issue in detail or use voice typing...'} 
                  style={{ resize: 'none' }}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />

                <div className="flbl">{t.urgencyLevelLabel}</div>
                <div className="urgency-row">
                  <button 
                    type="button"
                    className={`urg-btn low ${newUrgency === 'Low' ? 'sel' : ''}`}
                    onClick={() => setNewUrgency('Low')}
                  >
                    {t.lowLabel}
                  </button>
                  <button 
                    type="button"
                    className={`urg-btn med ${newUrgency === 'Medium' ? 'sel' : ''}`}
                    onClick={() => setNewUrgency('Medium')}
                  >
                    {t.mediumLabel}
                  </button>
                  <button 
                    type="button"
                    className={`urg-btn high ${newUrgency === 'High' ? 'sel' : ''}`}
                    onClick={() => setNewUrgency('High')}
                  >
                    {t.highLabel}
                  </button>
                </div>
              </div>

              <div className="form-card glass" style={{ marginTop: '0' }}>
                <div className="flbl" style={{ marginTop: '0' }}>{t.photoEvidenceLabel}</div>
                <label htmlFor="photo-upload-input" style={{ width: '100%', display: 'block' }}>
                  <div className="upload-box">
                    <i className="ti ti-camera" aria-hidden="true"></i>
                    <span>{newImage ? t.photoAttachedUpload : t.tapToUploadPhoto}</span>
                    <small>{t.uploadPhotoSizeLimit}</small>
                    {newImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <img src={newImage} alt="Preview" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                        {compressionInfo && (
                          <span style={{ fontSize: '10.5px', color: 'var(--green)', fontWeight: 700, background: '#f0fdf4', padding: '3px 8px', borderRadius: '6px' }}>
                            ✓ WebP {compressionInfo}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </label>
                <input 
                  id="photo-upload-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div className="flbl" style={{ margin: 0 }}>{t.locationLabel}</div>
                  <button
                    type="button"
                    onClick={handleAutoLocate}
                    style={{
                      border: 'none',
                      background: '#eff6ff',
                      color: '#2563eb',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="ti ti-current-location" aria-hidden="true"></i>
                    {language === 'te' ? 'GPS గుర్తించు' : 'Auto-Locate GPS'}
                  </button>
                </div>
                <div style={{ background: 'rgba(255,253,231,0.6)', border: '1.5px solid rgba(255,215,0,0.3)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '18px', color: '#CC9900' }}></i>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#663300' }}>{getTranslatedVillageName(newVillage)} Town</div>
                    <div style={{ fontSize: '10px', color: '#996600' }}>Kuppam constituency · Chittoor district</div>
                  </div>
                </div>
                <div style={{ marginTop: '14px' }}>
                  <button 
                    onClick={() => handleCreateIssue()} 
                    className="submit-btn"
                  >
                    {t.submitIssueBtn}
                    <i className="ti ti-send" aria-hidden="true" style={{ fontSize: '14px', verticalAlign: '-2px', marginLeft: '4px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'track' ? (
          <>
            <div className="raise-header" style={{ margin: '0 -14px' }}>
              <div className="raise-back" onClick={() => navigate('/dashboard')}>
                <i className="ti ti-arrow-left" aria-hidden="true"></i>
                <span>{t.backBtn}</span>
              </div>
              <div className="raise-title">{t.trackIssuesHeader}</div>
            </div>

            {/* Filter chips */}
            <div className="chips-wrap" role="group" aria-label="Filter by status" style={{ margin: '0 -14px' }}>
              <button className={`chip all ${trackChip === 'All' ? 'active' : ''}`} onClick={() => setTrackChip('All')}>
                {t.allCount} ({citizenIssues.length})
              </button>
              <button className={`chip pending ${trackChip === 'Pending' ? 'active' : ''}`} onClick={() => setTrackChip('Pending')}>
                {t.pendingCount} ({citizenIssues.filter(i => i.status === 'Pending').length})
              </button>
              <button className={`chip review ${trackChip === 'In Review' ? 'active' : ''}`} onClick={() => setTrackChip('In Review')}>
                {t.inReviewCount} ({citizenIssues.filter(i => i.status === 'In Review').length})
              </button>
              <button className={`chip resolved ${trackChip === 'Resolved' ? 'active' : ''}`} onClick={() => setTrackChip('Resolved')}>
                {t.resolvedCount} ({citizenIssues.filter(i => i.status === 'Resolved').length})
              </button>
              <button className={`chip withdrawn ${trackChip === 'Withdrawn' ? 'active' : ''}`} onClick={() => setTrackChip('Withdrawn')}>
                {t.withdrawnCount}
              </button>
            </div>

            <div className="scroll" style={{ paddingTop: '4px' }}>
              {/* Summary bar */}
              <div className="summary-bar">
                <div className="sum-cell glass">
                  <div className="sum-num" style={{ color: '#111' }}>{citizenIssues.length}</div>
                  <div className="sum-lbl">{t.totalCount}</div>
                </div>
                <div className="sum-cell glass-red">
                  <div className="sum-num" style={{ color: '#dc2626' }}>{citizenIssues.filter(i => i.status === 'Pending').length}</div>
                  <div className="sum-lbl">{t.pendingCount}</div>
                </div>
                <div className="sum-cell glass-gold">
                  <div className="sum-num" style={{ color: '#CC9900' }}>{citizenIssues.filter(i => i.status === 'In Review').length}</div>
                  <div className="sum-lbl">{t.inReviewCount}</div>
                </div>
                <div className="sum-cell glass-green">
                  <div className="sum-num" style={{ color: '#16a34a' }}>{citizenIssues.filter(i => i.status === 'Resolved').length}</div>
                  <div className="sum-lbl">{t.stepDone}</div>
                </div>
              </div>


              <div className="sec-row">
                <div className="sec-lbl">{t.yourIssuesLabel}</div>
                <div className="sec-count">
                  {filteredTrackIssues.length} {t.totalCountSuffix}
                </div>
              </div>

              {/* Cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredTrackIssues.length === 0 ? (
                  <div
                    style={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      background: 'var(--card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {t.noIssuesFound}
                  </div>
                ) : (
                  filteredTrackIssues.map((issue) => {
                    const parsed = parseIssueTitle(issue.title);
                    const st = getTrackStatusStyle(issue.status);
                    const catTheme = getCategoryTheme(issue.category);

                    const formattedId = `KUP-2026-${issue.id.padStart(4, '0')}`;

                    return (
                      <div 
                        key={issue.id} 
                        className={st.cardClass}
                        onClick={() => setSelectedIssueId(issue.id)}
                      >
                        <div className="tc-top">
                          <div className="tc-ico" style={{ background: st.icoBg }}>
                            <i className={catTheme.icon} aria-hidden="true" style={{ color: st.icoColor }}></i>
                          </div>
                          <div className="tc-body">
                            <div className="tc-hdr">
                              <div className="tc-title">{parsed.title}</div>
                              <span className="tc-pill" style={{ background: st.pillBg, color: st.pillColor }}>
                                {issue.status === 'Resolved' ? t.resolvedCount : issue.status === 'In Review' ? t.inReviewCount : t.pendingCount}
                                {issue.status === 'Resolved' ? ' ✓' : ''}
                              </span>
                            </div>
                            <div className="tc-id">
                              <i className="ti ti-hash" aria-hidden="true" style={{ fontSize: '10px' }}></i> {formattedId} · {getTranslatedCategoryName(issue.category)}
                            </div>
                          </div>
                        </div>

                        {/* progress stepper */}
                        {renderStepper(issue.status)}

                        {/* Status dynamic comment */}
                        {issue.status === 'In Review' && (
                          <div style={{ background: 'rgba(255,215,0,0.15)', borderRadius: '10px', padding: '8px 10px', marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                            <i className="ti ti-message-circle" aria-hidden="true" style={{ fontSize: '14px', color: '#CC9900', flexShrink: 0, marginTop: '1px' }}></i>
                            <div style={{ fontSize: '10px', color: '#663300', lineHeight: 1.5 }}>
                              {language === 'te' 
                                ? '"సమస్యను ఏపీఎస్‌పీడీసీఎల్ వాటర్ బోర్డుకు కేటాయించాము. రేపు ఉదయం బృందం పరిశీలిస్తుంది." — ఎమ్మెల్యే కార్యాలయం'
                                : '"Issue assigned to APSPDCL Water Board. Team will visit by tomorrow morning." — MLA Office'}
                            </div>
                          </div>
                        )}

                        {issue.status === 'Resolved' && (
                          <div style={{ background: 'rgba(187,247,208,0.35)', borderRadius: '10px', padding: '8px 10px', marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                            <i className="ti ti-message-circle" aria-hidden="true" style={{ fontSize: '14px', color: '#16a34a', flexShrink: 0, marginTop: '1px' }}></i>
                            <div style={{ fontSize: '10px', color: '#166534', lineHeight: 1.5 }}>
                              {language === 'te' 
                                ? '"వీధిదీపం భర్తీ చేయబడింది మరియు పని చేస్తోంది. 2 రోజుల్లో పరిష్కరించబడింది." — ఎమ్మెల్యే శ్రీ చంద్రబాబు నాయుడు'
                                : '"Streetlight replaced and functional. Resolved in 2 days." — MLA Sri Chandrababu Naidu'}
                            </div>
                          </div>
                        )}

                        {/* Date field */}
                        <div className="tc-date">
                          <i className="ti ti-clock" aria-hidden="true"></i>
                          {issue.status === 'Resolved' ? (
                            `${t.resolvedOn} 14 Jun 2025`
                          ) : issue.status === 'In Review' ? (
                            `${language === 'te' ? 'నవీకరించబడింది ఇప్పుడే' : 'Updated just now'} · ${t.estResolution}: 2 ${language === 'te' ? 'రోజులు' : 'days'}`
                          ) : (
                            `${language === 'te' ? '3 రోజుల క్రితం నమోదైంది' : 'Raised 3 days ago'} · ${t.awaitingMlaReview}`
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="raise-header" style={{ margin: '0 -14px' }}>
              <div className="raise-back" onClick={() => navigate('/dashboard')}>
                <i className="ti ti-arrow-left" aria-hidden="true"></i>
                <span>{t.backBtn}</span>
              </div>
              <div className="raise-title">{t.myIssuesHeader}</div>
            </div>

            <div className="scroll" style={{ paddingTop: '4px' }}>
              <div className="rate-card glass" style={{ margin: '0 0 16px 0' }}>
                <div className="rate-row">
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{t.villageResolutionRate}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>{dynamicRateFloat}%</div>
                </div>
                <div className="rate-trk">
                  <div className="rate-fill" style={{ width: `${dynamicRateFloat}%` }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#bbb', marginTop: '5px' }}>{t.rankedFirstInConstituency}</div>
              </div>

              <div style={{ padding: '0 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bbb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  {t.myIssuesCountLabel} ({citizenIssues.length})
                </div>
                <span 
                  onClick={() => setSearchParams({ tab: 'raise' })}
                  style={{ fontSize: '11px', color: '#CC9900', fontWeight: '600', cursor: 'pointer' }}
                >
                  {t.raiseNewBtn}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {citizenIssues.length === 0 ? (
                  <div
                    style={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      background: 'var(--card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {t.noIssuesFound}
                  </div>
                ) : (
                  citizenIssues.map((issue) => {
                    const parsed = parseIssueTitle(issue.title);
                    const theme = getCategoryTheme(issue.category);

                    return (
                      <div 
                        key={issue.id} 
                        className="issue-card glass"
                        onClick={() => {
                          if (editingIssueId !== issue.id) {
                            setSelectedIssueId(issue.id);
                          }
                        }}
                      >
                        <div className="iss-row">
                          <div className="iss-ico" style={{ background: theme.bg }}>
                            <i className={theme.icon} style={{ color: theme.color }} aria-hidden="true" />
                          </div>
                          <div className="iss-body">
                            <div className="iss-hdr">
                              <div className="iss-title">{parsed.title}</div>
                              <span className="status-pill" style={getStatusStyle(issue.status)}>
                                {issue.status === 'Resolved' ? t.resolvedStatus : issue.status === 'In Review' ? t.inReviewStatus : t.pendingStatus}
                                {issue.status === 'Resolved' ? ' ✓' : ''}
                              </span>
                            </div>
                            <div className="iss-meta">
                              <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '10px' }} />
                              {getTranslatedCategoryName(issue.category)} · {getTranslatedVillageName(issue.village)} Town
                            </div>
                            <div className="iss-date">
                              {issue.date}
                            </div>
                            
                            {/* Inline Edit Form */}
                            {editingIssueId === issue.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0 4px', width: '100%', borderTop: '1px solid #f0f0f0', marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bbb', textTransform: 'uppercase', textAlign: 'left' }}>{t.issueTitleLabel}</div>
                                <input 
                                  className="finput"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  style={{ padding: '6px 10px', fontSize: '12px' }}
                                />
                                
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bbb', textTransform: 'uppercase', textAlign: 'left' }}>{t.descriptionLabel}</div>
                                <textarea 
                                  className="finput"
                                  rows={2}
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  style={{ padding: '6px 10px', fontSize: '12px', resize: 'none' }}
                                />

                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bbb', textTransform: 'uppercase', textAlign: 'left' }}>{t.categoryLabel}</div>
                                <select 
                                  className="finput"
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  style={{ padding: '6px 10px', fontSize: '12px', background: '#f8f8f8' }}
                                >
                                  <option value="Road / Infra">{t.roadInfra}</option>
                                  <option value="Water supply">{t.waterSupply}</option>
                                  <option value="Electricity">{t.electricity}</option>
                                  <option value="Health">{t.health}</option>
                                  <option value="Education">{t.education}</option>
                                  <option value="Personal">{t.personal}</option>
                                </select>

                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bbb', textTransform: 'uppercase', textAlign: 'left' }}>{t.urgencyLevelLabel}</div>
                                <div className="urgency-row">
                                  <button 
                                    type="button" 
                                    className={`urg-btn low ${editUrgency === 'Low' ? 'sel' : ''}`}
                                    onClick={() => setEditUrgency('Low')}
                                    style={{ padding: '6px', fontSize: '11px' }}
                                  >
                                    {t.lowLabel}
                                  </button>
                                  <button 
                                    type="button" 
                                    className={`urg-btn med ${editUrgency === 'Medium' ? 'sel' : ''}`}
                                    onClick={() => setEditUrgency('Medium')}
                                    style={{ padding: '6px', fontSize: '11px' }}
                                  >
                                    {t.mediumLabel}
                                  </button>
                                  <button 
                                    type="button" 
                                    className={`urg-btn high ${editUrgency === 'High' ? 'sel' : ''}`}
                                    onClick={() => setEditUrgency('High')}
                                    style={{ padding: '6px', fontSize: '11px' }}
                                  >
                                    {t.highLabel}
                                  </button>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                  <button 
                                    onClick={() => {
                                      if (!editTitle.trim()) {
                                        alert(t.fillAllFields);
                                        return;
                                      }
                                      const packedTitle = editDesc.trim() 
                                        ? `${editTitle.trim()}||${editDesc.trim()}||${editUrgency}`
                                        : `${editTitle.trim()}||||${editUrgency}`;

                                      dispatch(updateIssueDetails({
                                        id: issue.id,
                                        title: packedTitle,
                                        category: editCategory
                                      }));

                                      setEditingIssueId(null);
                                    }}
                                    style={{ flex: 1, padding: '7px 12px', background: '#FFD700', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#663300', cursor: 'pointer' }}
                                  >
                                    {language === 'te' ? 'సేవ్' : 'Save'}
                                  </button>
                                  <button 
                                    onClick={() => setEditingIssueId(null)}
                                    style={{ padding: '7px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#666', cursor: 'pointer' }}
                                  >
                                    {language === 'te' ? 'రద్దు' : 'Cancel'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Edit / Withdraw Action Buttons for Non-Resolved issues */
                              issue.status !== 'Resolved' && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingIssueId(issue.id);
                                      setEditTitle(parsed.title);
                                      setEditDesc(parsed.description || '');
                                      setEditCategory(issue.category);
                                      setEditUrgency(parsed.urgency || 'Medium');
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid rgba(255, 215, 0, 0.5)', borderRadius: '6px', padding: '5px 10px', fontSize: '10px', fontWeight: '700', color: '#996600', cursor: 'pointer', fontFamily: 'inherit' }}
                                  >
                                    <i className="ti ti-edit" aria-hidden="true"></i>
                                    {language === 'te' ? 'సవరించు' : 'Edit'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(language === 'te' ? 'మీరు ఖచ్చితంగా సమస్యను ఉపసంహరించుకోవాలనుకుంటున్నారా?' : 'Are you sure you want to withdraw this issue?')) {
                                        handleUpdateStatus(issue.id, 'Resolved');
                                        alert(language === 'te' ? 'సమస్య విజయవంతంగా ఉపసంహరించుకోబడింది!' : 'Grievance marked as withdrawn successfully!');
                                      }
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '6px', padding: '5px 10px', fontSize: '10px', fontWeight: '700', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                                  >
                                    <i className="ti ti-trash-x" aria-hidden="true"></i>
                                    {language === 'te' ? 'ఉపసంహరించుకో' : 'Withdraw'}
                                  </button>
                                </div>
                              )
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Detailed View for MLA
  if (selectedMlaIssueId) {
    const issue = issues.find((i) => i.id === selectedMlaIssueId);
    if (issue) {
      const parsed = parseIssueTitle(issue.title);
      const theme = getCategoryTheme(issue.category);

      const handleSaveMlaAction = () => {
        localStorage.setItem(`apgov_issue_assignment_${issue.id}`, mlaAssignedOfficer);
        localStorage.setItem(`apgov_issue_resnote_${issue.id}`, mlaResolutionNote);

        dispatch(addNotification({
          title: 'Grievance Actions Saved',
          description: `Actions updated for Issue #KUP-2026-${issue.id.padStart(4, '0')}.`
        }));

        alert(language === 'te' ? 'చర్య విజయవంతంగా సేవ్ చేయబడింది!' : 'Action saved successfully!');
        setSelectedMlaIssueId(null);
      };

      const handleAddMlaComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMlaCommentText.trim()) return;
        const newComment = {
          id: Date.now().toString(),
          name: language === 'te' ? 'ఎమ్మెల్యే కార్యాలయం' : 'MLA Office Team',
          text: newMlaCommentText.trim(),
          time: language === 'te' ? 'ఇప్పుడే' : 'Just now'
        };
        const updated = [...mlaComments, newComment];
        setMlaComments(updated);
        localStorage.setItem(`apgov_issue_comments_${issue.id}`, JSON.stringify(updated));
        setNewMlaCommentText('');
      };

      const heroGradient = issue.status === 'Resolved' 
        ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' 
        : issue.status === 'In Review' 
          ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' 
          : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';

      return (
        <div id="page-issues-detail" style={{ margin: '-16px -14px -80px -14px', minHeight: 'calc(100% + 96px)', background: '#f5f5f5', position: 'relative', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
          
          {/* Floating Translucent Header */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' }}>
            <button 
              onClick={() => setSelectedMlaIssueId(null)}
              style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            >
              <i className="ti ti-arrow-left" style={{ fontSize: '18px' }} aria-hidden="true" />
            </button>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Issue #KUP-2026-{issue.id.padStart(4, '0')}
            </span>
            <div style={{ width: '36px' }} />
          </div>

          {/* Hero Banner Section */}
          <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden', background: heroGradient }}>
            {issue.image && (
              <img src={issue.image} alt={parsed.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', color: '#fff' }}>
              <span style={{ background: theme.color, color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>
                {getTranslatedCategoryName(issue.category)}
              </span>
              <h1 style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.4', color: '#ffffff', margin: '0 0 6px', textShadow: '0 1px 4px rgba(0,0,0,0.3)', textAlign: 'left' }}>
                {parsed.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>
                <span><i className="ti ti-map-pin" style={{ marginRight: '3px' }} />{getTranslatedVillageName(issue.village)}</span>
                <span>·</span>
                <span>{issue.date}</span>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            
            {/* Description Card */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
              <div style={{ fontSize: '12.5px', color: '#333', lineHeight: '1.6', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'left' }}>
                {parsed.description || parsed.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: '#888' }}>{language === 'te' ? 'తీవ్రత స్థాయి' : 'Urgency Level'}</span>
                  <span style={{ fontWeight: '700', color: parsed.urgency === 'High' ? '#dc2626' : parsed.urgency === 'Medium' ? '#CC9900' : '#16a34a' }}>
                    {language === 'te' ? (parsed.urgency === 'High' ? t.highLabel : parsed.urgency === 'Medium' ? t.mediumLabel : t.lowLabel) : parsed.urgency}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: '#888' }}>{language === 'te' ? 'నివేదించిన పౌరుడు' : 'Reporter (Citizen)'}</span>
                  <span style={{ fontWeight: '600', color: '#222' }}>{issue.reporter || 'Anonymous'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: '#888' }}>{language === 'te' ? 'గ్రామం' : 'Location'}</span>
                  <span style={{ fontWeight: '600', color: '#222' }}>{getTranslatedVillageName(issue.village)} Town</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '14px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px', textAlign: 'left' }}>
                {t.issueTimeline}
              </h3>
              
              <div className="timeline" style={{ margin: 0 }}>
                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: '#16a34a' }}></div>
                    <div className="tl-line"></div>
                  </div>
                  <div className="tl-body">
                    <div className="tl-label">{t.issueRaisedStatus}</div>
                    <div className="tl-note">{language === 'te' ? `పౌరుడు ${issue.reporter || ''} ద్వారా నివేదించబడింది` : `Submitted by citizen ${issue.reporter || ''}`}</div>
                    <div className="tl-time">{issue.date}</div>
                  </div>
                </div>

                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: issue.status !== 'Pending' ? '#16a34a' : '#ddd' }}></div>
                    <div className="tl-line"></div>
                  </div>
                  <div className="tl-body">
                    <div className="tl-label">{t.acknowledgedStatus}</div>
                    <div className="tl-note">
                      {issue.status !== 'Pending' 
                        ? (language === 'te' ? `ఎమ్మెల్యే కార్యాలయం ఆమోదించింది మరియు ${mlaAssignedOfficer || 'ఫీల్డ్ అధికారి'}కి కేటాయించబడింది` : `Acknowledged and assigned to ${mlaAssignedOfficer || 'Field Officer'}`) 
                        : (language === 'te' ? 'ఎమ్మెల్యే సమీక్ష మరియు కేటాయింపు కోసం వేచి ఉంది' : 'Awaiting review and assignment')}
                    </div>
                    <div className="tl-time">{issue.status !== 'Pending' ? (language === 'te' ? 'నవీకరించబడింది' : 'Updated') : '--'}</div>
                  </div>
                </div>

                <div className="tl-item">
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background: issue.status === 'Resolved' ? '#16a34a' : '#ddd' }}></div>
                  </div>
                  <div className="tl-body">
                    <div className="tl-label">{t.resolvedStatus}</div>
                    <div className="tl-note">
                      {issue.status === 'Resolved' 
                        ? mlaResolutionNote || (language === 'te' ? 'సమస్య విజయవంతంగా పరిష్కరించబడింది.' : 'Issue resolved successfully.')
                        : (language === 'te' ? 'శాఖ నుండి పరిష్కార నివేదిక కోసం వేచి ఉంది' : 'Awaiting resolution note from department')}
                    </div>
                    <div className="tl-time">{issue.status === 'Resolved' ? (language === 'te' ? 'పూర్తయింది' : 'Completed') : '--'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MLA Action Control Center */}
            <div style={{ background: '#ffffff', border: '1.5px solid rgba(204, 153, 0, 0.4)', borderRadius: '16px', padding: '14px', boxShadow: '0 2px 10px rgba(204, 153, 0, 0.05)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#996600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-start' }}>
                <i className="ti ti-tool" style={{ fontSize: '14px' }}></i> {language === 'te' ? 'ఎమ్మెల్యే చర్యల కేంద్రం' : 'MLA Action Center'}
              </h3>

              {/* Status Update Buttons */}
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#666', marginBottom: '6px', textTransform: 'uppercase' }}>{language === 'te' ? 'సమస్య స్థితిని నవీకరించండి' : 'Update Grievance Status'}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Pending', 'In Review', 'Resolved'] as const).map((s) => {
                    const isSelected = issue.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => dispatch(updateIssueStatus({ id: issue.id, status: s }))}
                        style={{
                          flex: 1,
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? 'none' : '1px solid #ddd',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          ...getStatusStyle(s),
                          opacity: isSelected ? 1 : 0.5,
                        }}
                      >
                        {s === 'Pending' ? t.pending : s === 'In Review' ? t.inReview : t.resolved}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Officer Assignment */}
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label htmlFor="assign-officer" style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: '#666', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {language === 'te' ? 'ఫీల్డ్ అధికారిని కేటాయించండి' : 'Assign Field Officer'}
                </label>
                <select
                  id="assign-officer"
                  value={mlaAssignedOfficer}
                  onChange={(e) => setMlaAssignedOfficer(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '12px', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                >
                  <option value="">{language === 'te' ? '-- అధికారిని ఎంచుకోండి --' : '-- Select Field Officer --'}</option>
                  <option value="Officer Anand (Water & Infra)">Officer Anand (Water & Infra)</option>
                  <option value="Officer Prasad (Power Grid)">Officer Prasad (Power Grid)</option>
                  <option value="Officer Satish (Roads & Sanitation)">Officer Satish (Roads & Sanitation)</option>
                  <option value="Officer Lakshmi (Welfare & Health)">Officer Lakshmi (Welfare & Health)</option>
                </select>
              </div>

              {/* Resolution Note */}
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label htmlFor="res-note" style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: '#666', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {language === 'te' ? 'పరిష్కార నివేదిక (పౌరుడికి కనిపిస్తుంది)' : 'Resolution Note (Will be visible to Citizen)'}
                </label>
                <textarea
                  id="res-note"
                  rows={2}
                  value={mlaResolutionNote}
                  onChange={(e) => setMlaResolutionNote(e.target.value)}
                  placeholder={language === 'te' ? 'సమస్యను పరిష్కరించడానికి తీసుకున్న చర్యను వివరించండి...' : 'Describe the action taken to resolve this issue...'}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '12px', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMlaAction}
                style={{ width: '100%', padding: '11px', background: '#CC9900', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <i className="ti ti-circle-check"></i> {language === 'te' ? 'చర్యలను సేవ్ చేయి' : 'Save Grievance Actions'}
              </button>
            </div>

            {/* Comments Section */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '14px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', textAlign: 'left' }}>
                {language === 'te' ? 'అంతర్గత చర్చలు & గమనికలు' : 'Grievance Discussion & Notes'}
              </h3>

              <form onSubmit={handleAddMlaComment} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input 
                  type="text"
                  value={newMlaCommentText}
                  onChange={(e) => setNewMlaCommentText(e.target.value)}
                  placeholder={language === 'te' ? 'గమనికను జోడించండి...' : 'Post an update or note...'}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '11.5px', outline: 'none', fontFamily: 'inherit' }}
                />
                <button 
                  type="submit"
                  style={{ background: '#CC9900', border: 'none', borderRadius: '8px', padding: '0 12px', fontSize: '11.5px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {language === 'te' ? 'జోడించు' : 'Post'}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mlaComments.map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: c.name.includes('MLA') || c.name.includes('ఎమ్మెల్యే') ? 'var(--gold-bg)' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: c.name.includes('MLA') || c.name.includes('ఎమ్మెల్యే') ? 'var(--gold-deep)' : '#666' }}>
                      {c.name.includes('MLA') || c.name.includes('ఎమ్మెల్యే') ? 'CB' : 'C'}
                    </div>
                    <div style={{ flex: 1, background: '#f9f9f9', borderRadius: '10px', padding: '6px 8px', border: '1px solid #f0f0f0', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#333' }}>{c.name}</span>
                        <span style={{ fontSize: '8px', color: '#aaa' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.3' }}>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      );
    }
  }

  // Return for MLA/Official List View
  return (
    <div id="page-issues" style={{ margin: '-16px -14px -80px -14px', minHeight: 'calc(100% + 96px)', background: '#f5f5f5', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Header Bar */}
      <div 
        style={{
          background: '#ffffff',
          padding: '16px 14px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#111',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: '20px' }} aria-hidden="true" />
        </button>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#111' }}>
          {language === 'te' ? 'నియోజకవర్గ ఫిర్యాదులు' : 'Grievances & Actions'}
        </span>
      </div>

      <div style={{ padding: '12px 14px 30px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        
        {/* Village Filter Alert Badge */}
        {villageFilter && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--gold-bg)',
              border: '1px solid var(--gold-border)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '11px',
              color: 'var(--gold-deep)',
            }}
          >
            <span>
              {t.showingIssuesInVillage} <strong>{getTranslatedVillageName(villageFilter)}</strong>
            </span>
            <button
              onClick={clearVillageFilter}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-deep)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {t.clear}
            </button>
          </div>
        )}

        {/* Scope Selector Tabs */}
        <div className="tog-wrap" style={{ margin: '0' }}>
          <div className="tog-pill" style={{ background: 'rgba(0,0,0,0.04)', display: 'flex', gap: '2px', padding: '2px' }}>
            {(['All', 'Pending', 'In Review', 'Resolved'] as const).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  className={`tog-b ${isActive ? 'on' : ''}`}
                  onClick={() => setStatusFilter(status)}
                  style={{ flex: 1, padding: '8px 10px', fontSize: '11px', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {status === 'All' ? t.allFilter : status === 'Pending' ? t.pending : status === 'In Review' ? t.inReview : t.resolved}
                </button>
              );
            })}
          </div>
        </div>

        {/* Issues list styled as NewsList cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {filteredIssues.length === 0 ? (
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '30px 20px',
                textAlign: 'center',
                color: '#888',
                fontSize: '12px',
              }}
            >
              <i className="ti ti-clipboard-off" style={{ fontSize: '28px', color: '#ccc', marginBottom: '8px', display: 'block' }} aria-hidden="true" />
              {t.noIssuesFound}
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const parsed = parseIssueTitle(issue.title);
              const theme = getCategoryTheme(issue.category);
              const statusColor = issue.status === 'Resolved' ? '#16a34a' : issue.status === 'In Review' ? '#CC9900' : '#dc2626';

              return (
                <div 
                  key={issue.id} 
                  className="nc" 
                  onClick={() => setSelectedMlaIssueId(issue.id)}
                  style={{ marginBottom: 0 }}
                >
                  {/* Left Accent Strip colored by status */}
                  <div className="nc-accent" style={{ background: statusColor }}></div>
                  <div className="nc-inner" style={{ padding: '12px 14px' }}>
                    
                    {/* Left: Thumbnail or Category Icon */}
                    {issue.image ? (
                      <img 
                        src={issue.image} 
                        alt={parsed.title}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid rgba(0,0,0,0.04)',
                        }}
                      />
                    ) : (
                      <div 
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          background: theme.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <i className={theme.icon} style={{ color: theme.color, fontSize: '24px' }} aria-hidden="true" />
                      </div>
                    )}

                    {/* Right Side: Metadata, Title, Location */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', fontWeight: '800', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          {getTranslatedCategoryName(issue.category)}
                        </span>
                        <span className="issue-status" style={{ ...getStatusStyle(issue.status), fontSize: '9px', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                          {issue.status === 'Resolved' ? t.resolved : issue.status === 'In Review' ? t.inReview : t.pending}
                        </span>
                      </div>

                      <h3 
                        style={{
                          fontSize: '12.5px',
                          fontWeight: '700',
                          color: '#111',
                          lineHeight: '1.4',
                          margin: '2px 0 4px',
                          textAlign: 'left',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {parsed.title}
                      </h3>

                      <div className="nc-meta" style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '10px', marginRight: '2px' }} />
                          {getTranslatedVillageName(issue.village)}
                        </span>
                        <span style={{ fontSize: '9px', color: '#bbb' }}>
                          {issue.date}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Space for Bottom Nav spacing */}
        <div style={{ height: '50px' }} />
      </div>

      {/* Floating Action Button */}
      <button
        className="floating-add-btn"
        aria-label={t.newComplaint}
        onClick={() => dispatch(setNewIssueModalOpen(true))}
      >
        <i className="ti ti-plus" aria-hidden="true" />
      </button>

      {/* Bottom Sheet New Issue Modal */}
      {newIssueModalOpen && (
        <div className="modal-overlay" onClick={() => dispatch(setNewIssueModalOpen(false))}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{t.raiseNewIssue}</div>
              <button className="close-btn" onClick={() => dispatch(setNewIssueModalOpen(false))}>
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="issue-title">{t.issueDescription}</label>
                <div className="input-with-icon">
                  <i className="ti ti-edit-circle" aria-hidden="true" />
                  <input
                    id="issue-title"
                    className="form-input"
                    placeholder={t.issueDescPlaceholder}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="issue-category">{t.categoryLabel}</label>
                <div className="input-with-icon">
                  <i className="ti ti-tag" aria-hidden="true" />
                  <select
                    id="issue-category"
                    className="form-input"
                    style={{ paddingLeft: '38px', appearance: 'none' }}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Road / Infra">{t.roadInfra}</option>
                    <option value="Water supply">{t.waterSupply}</option>
                    <option value="Electricity">{t.electricity}</option>
                    <option value="Health">{t.health}</option>
                    <option value="Education">{t.education}</option>
                    <option value="Personal">{t.personal}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="issue-village">{t.villageLabel}</label>
                <div className="input-with-icon">
                  <i className="ti ti-map-pin" aria-hidden="true" />
                  <select
                    id="issue-village"
                    className="form-input"
                    style={{ paddingLeft: '38px', appearance: 'none' }}
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                  >
                    <option value="Kuppam">{t.kuppam}</option>
                    <option value="Ramagiri">{t.ramagiri}</option>
                    <option value="Gudupalli">{t.gudupalli}</option>
                    <option value="Venkatapur">{t.venkatapur}</option>
                    <option value="Bethampudi">{t.bethampudi}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="issue-reporter">{t.citizenReporter}</label>
                <div className="input-with-icon">
                  <i className="ti ti-user" aria-hidden="true" />
                  <input
                    id="issue-reporter"
                    className="form-input"
                    placeholder={t.reporterPlaceholder}
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Photo Attachment Field */}
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label htmlFor="issue-image" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  {t.uploadPhoto}
                </label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <i className="ti ti-camera" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
                  <input
                    id="issue-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '12px',
                      border: '1px dashed var(--gold)',
                      background: 'var(--gold-bg)',
                      fontSize: '11.5px',
                      fontFamily: 'inherit',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                {newImage && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={newImage} alt="Preview" style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <span style={{ fontSize: '10px', color: 'var(--green)', fontWeight: '600' }}>✓ {t.photoAttachedUpload}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="login-btn"
                style={{ width: '100%', marginTop: '10px' }}
              >
                {t.logComplaint}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
