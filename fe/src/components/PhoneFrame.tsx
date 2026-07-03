import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { toggleNotifications, markNotificationsRead } from '../store/uiSlice';
import BottomNav from './BottomNav';
import { translations } from '../i18n/translations';
import { useLocation, useSearchParams } from 'react-router-dom';

interface PhoneFrameProps {
  children?: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, showNotifications } = useAppSelector((state) => state.ui);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentScreen = searchParams.get('screen') || 'home';
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
  const [timeStr, setTimeStr] = useState('09:41');

  // Live status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotifClick = () => {
    dispatch(toggleNotifications());
    if (!showNotifications) {
      dispatch(markNotificationsRead());
    }
  };

  const getTranslatedVillage = (villageName: string) => {
    if (villageName === 'Kuppam') return t.kuppam;
    if (villageName === 'Ramagiri') return t.ramagiri;
    if (villageName === 'Gudupalli') return t.gudupalli;
    if (villageName === 'Venkatapur') return t.venkatapur;
    if (villageName === 'Bethampudi') return t.bethampudi;
    return villageName;
  };

  const getTranslatedMlaName = (name: string | undefined) => {
    if (!name) return language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu';
    if (name === 'Sri N. Chandrababu Naidu') {
      return language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu';
    }
    return name;
  };

  const getTranslatedConstituency = (constituency: string | undefined) => {
    if (!constituency) return t.kuppamConstituency;
    if (constituency.includes('Kuppam')) return t.kuppamConstituency;
    return constituency;
  };

  const getTranslatedNotification = (title: string, desc: string, time: string) => {
    if (language === 'en') return { title, desc, time };
    
    let tTitle = title;
    let tDesc = desc;
    let tTime = time;

    // Title translations
    if (title === 'Water Complaint') tTitle = 'నీటి సమస్య ఫిర్యాదు';
    else if (title === 'Road Works Escalated') tTitle = 'రహదారి పనుల సమస్య';
    else if (title === 'System Resolution') tTitle = 'వ్యవస్థ ద్వారా పరిష్కారం';
    else if (title === 'New Issue Raised') tTitle = 'కొత్త సమస్య నమోదైంది';
    else if (title.startsWith('Issue ')) {
      const status = title.replace('Issue ', '');
      let tStatus = status;
      if (status === 'Resolved') tStatus = 'పరిష్కరించబడింది';
      else if (status === 'In Review') tStatus = 'పరిశీలనలో ఉంది';
      else if (status === 'Pending') tStatus = 'పెండింగ్‌లో ఉంది';
      tTitle = `సమస్య ${tStatus}`;
    }

    // Description translations
    if (desc === 'Lakshmi Devi raised a water supply issue in Ramagiri.') {
      tDesc = 'రామగిరిలో లక్ష్మీదేవి నీటి సరఫరా సమస్యను లేవనెత్తారు.';
    } else if (desc === 'Ravi Kumar reported critical potholes in Kuppam.') {
      tDesc = 'కుప్పంలో రవికుమార్ తీవ్రమైన గుంతల గురించి నివేదించారు.';
    } else if (desc === 'Streetlight outage resolved automatically in Gudupalli.') {
      tDesc = 'గుడుపల్లిలో వీధిదీపాల నిలిపివేత సమస్య స్వయంచాలకంగా పరిష్కరించబడింది.';
    } else if (desc.includes('raised an issue:')) {
      const parts = desc.split(' raised an issue: ');
      if (parts.length === 2) {
        const reporterName = parts[0];
        const rest = parts[1].split(' in ');
        const issueText = rest[0];
        const villageName = rest[1] ? rest[1].replace('.', '') : '';
        const translatedVillage = villageName === 'Kuppam' ? 'కుప్పం' : villageName === 'Ramagiri' ? 'రామగిరి' : villageName === 'Gudupalli' ? 'గుడుపల్లి' : villageName === 'Venkatapur' ? 'వెంకటాపురం' : villageName === 'Bethampudi' ? 'బెతంపూడి' : villageName;
        tDesc = `${translatedVillage}లో ${reporterName} ఒక సమస్యను లేవనెత్తారు: ${issueText}`;
      }
    } else if (desc.includes('is now')) {
      const parts = desc.split(' is now ');
      if (parts.length === 2) {
        const issueText = parts[0];
        const status = parts[1].replace('.', '');
        let tStatus = status;
        if (status === 'Resolved') tStatus = 'పరిష్కరించబడింది';
        else if (status === 'In Review') tStatus = 'పరిశీలనలో ఉంది';
        else if (status === 'Pending') tStatus = 'పెండింగ్‌లో ఉంది';
        tDesc = `${issueText} ఇప్పుడు ${tStatus}.`;
      }
    }

    // Time translations
    if (time === '1 hour ago') tTime = '1 గంట క్రితం';
    else if (time === '3 hours ago') tTime = '3 గంటల క్రితం';
    else if (time === '1 day ago') tTime = '1 రోజు క్రితం';
    else if (time === 'Just now') tTime = 'ఇప్పుడే';

    return { title: tTitle, desc: tDesc, time: tTime };
  };



  return (
    <div className="phone-wrap">
      <div className="phone-inner">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="status-time">{timeStr}</span>
          <div className="status-icons">
            <i className="ti ti-signal-4g" aria-hidden="true"></i>
            <i className="ti ti-wifi" aria-hidden="true"></i>
            <i className="ti ti-battery-2" aria-hidden="true"></i>
          </div>
        </div>

        {/* Top Bar */}
        {isDashboard && user?.role !== 'fieldofficer' && user?.role !== 'coordinator' && (
          user?.role === 'citizen' ? (
            <div className="citizen-topbar d1">
              <div className="trow">
                <div>
                  <div className="greet">{language === 'te' ? 'నమస్కారం · శుభోదయం' : 'Namaskaram · Good morning'}</div>
                  <div className="uname" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ti ti-user-circle" style={{ fontSize: '18px', color: 'var(--gold-dark)', opacity: 0.9 }} aria-hidden="true"></i>
                    <span>{user?.name}</span>
                  </div>
                </div>
                <button
                  className="bell"
                  aria-label="Notifications"
                  onClick={handleNotifClick}
                >
                  <i className="ti ti-bell" aria-hidden="true"></i>
                  {unreadCount > 0 && <div className="bell-badge">{unreadCount}</div>}
                </button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div className="vchip">
                  <i className="ti ti-map-pin" aria-hidden="true"></i>
                  {getTranslatedVillage(user?.designation?.split(' · ')[1] || 'Kuppam')} · {language === 'te' ? 'చిత్తూరు' : 'Chittoor'}
                </div>
              </div>
            </div>
          ) : (
            <div className="topbar">
              <div className="topbar-row">
                <div>
                  <div className="greeting">{t.greeting}</div>
                  <div className="mla-name">{getTranslatedMlaName(user?.name)}</div>
                </div>
                <button
                  className="notif-btn"
                  aria-label="Notifications"
                  onClick={handleNotifClick}
                >
                  <i className="ti ti-bell" aria-hidden="true"></i>
                  {unreadCount > 0 && <span className="notif-badge" />}
                </button>
              </div>
              <div className="const-chip">
                <i className="ti ti-map-pin" aria-hidden="true"></i>
                {getTranslatedConstituency(user?.constituency)}
              </div>
            </div>
          )
        )}

        {/* Notification Drawer */}
        {showNotifications && (
          <>
            <div className="notif-overlay" onClick={handleNotifClick} style={{ top: user?.role === 'citizen' ? '128px' : '124px' }} />
            <div className="notif-drawer" style={{ top: user?.role === 'citizen' ? '138px' : '135px' }}>
              <div className="section-label" style={{ marginBottom: '8px', fontSize: '9px' }}>
                {t.activeAlerts}
              </div>
              {notifications.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                  {t.noNotifications}
                </div>
              ) : (
                notifications.map((notif) => {
                  const translatedNotif = getTranslatedNotification(notif.title, notif.description, notif.time);
                  return (
                    <div key={notif.id} className="notif-item">
                      <div className="notif-title">{translatedNotif.title}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{translatedNotif.desc}</div>
                      <div className="notif-time">{translatedNotif.time}</div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Scrollable Content */}
        <div 
          className={`scroll-area ${
            user?.role === 'citizen' ? 'citizen-scroll' : 
            user?.role === 'coordinator' ? 'coordinator-scroll' : 
            user?.role === 'fieldofficer' ? 'fieldofficer-scroll' : ''
          }`} 
          id="scroll-area"
        >
          {children}
        </div>

        {/* Glassmorphism Floating Bottom Nav (Only for MLA/Official) */}
        {user?.role !== 'citizen' && user?.role !== 'fieldofficer' && user?.role !== 'coordinator' && <BottomNav />}

        {/* Field Officer Bottom Nav (Fixed) */}
        {user?.role === 'fieldofficer' && currentScreen !== 'detail' && (
          <div className="nav-floating-area">
            <nav className="bottom-nav" role="navigation" aria-label="Field officer navigation">
              <button 
                className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`} 
                onClick={() => setSearchParams({ screen: 'home' })} 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="ti ti-layout-dashboard" aria-hidden="true"></i>
                <span>Home</span>
                {currentScreen === 'home' && <div className="nav-active-pip" />}
              </button>
              <button 
                className={`nav-item ${currentScreen === 'tasks' ? 'active' : ''}`} 
                onClick={() => setSearchParams({ screen: 'tasks' })} 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="ti ti-list-details" aria-hidden="true"></i>
                <span>Assignments</span>
                {currentScreen === 'tasks' && <div className="nav-active-pip" />}
              </button>
              <button 
                className={`nav-item ${currentScreen === 'map' ? 'active' : ''}`} 
                onClick={() => setSearchParams({ screen: 'map' })} 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="ti ti-map-pin" aria-hidden="true"></i>
                <span>Map</span>
                {currentScreen === 'map' && <div className="nav-active-pip" />}
              </button>
              <button 
                className={`nav-item ${currentScreen === 'stats' ? 'active' : ''}`} 
                onClick={() => setSearchParams({ screen: 'stats' })} 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="ti ti-chart-bar" aria-hidden="true"></i>
                <span>Stats</span>
                {currentScreen === 'stats' && <div className="nav-active-pip" />}
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneFrame;
