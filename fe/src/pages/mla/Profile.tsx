import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { setLanguage } from '../../store/uiSlice';
import { translations } from '../../i18n/translations';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.ui);
  const { stats, grievances } = useAppSelector((state) => state.citizen);
  const { list: fallbackIssues } = useAppSelector((state) => state.issues);
  const t = translations[language];

  const getTranslatedName = () => {
    if (user?.role === 'citizen') {
      return user?.name || (language === 'te' ? 'పౌరుడు' : 'Citizen');
    }
    if (!user?.name || user?.name === 'Sri N. Chandrababu Naidu') {
      return language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu';
    }
    return user.name;
  };

  const getTranslatedDesignation = () => {
    if (user?.role === 'citizen') {
      const villageName = user?.designation?.split(' · ')[1] || 'Kuppam';
      const translatedVillage = villageName === 'Kuppam' ? t.kuppam : villageName === 'Ramagiri' ? t.ramagiri : villageName === 'Gudupalli' ? t.gudupalli : villageName === 'Venkatapur' ? t.venkatapur : villageName === 'Bethampudi' ? t.bethampudi : villageName;
      return `${language === 'te' ? 'పౌరుడు' : 'Citizen'} · ${translatedVillage}`;
    }
    if (user?.designation === 'MLA & Chief Minister of Andhra Pradesh') {
      return language === 'te' ? 'ఎమ్మెల్యే & ఆంధ్రప్రదేశ్ ముఖ్యమంత్రి' : 'MLA & Chief Minister of Andhra Pradesh';
    }
    return user?.designation || (language === 'te' ? 'అధికారి' : 'Official');
  };

  const handleLogout = () => {
    if (window.confirm(t.confirmSignOut)) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const citizenIssues = grievances && grievances.length > 0
    ? grievances
    : fallbackIssues.filter((i) => i.reporter === user?.name);
  const totalCount = stats ? stats.myIssuesCount : citizenIssues.length;
  const resolvedCount = citizenIssues.filter((i) => i.status === 'Resolved').length;
  const pendingCount = Math.max(0, totalCount - resolvedCount);

  return (
    <div id="page-profile" style={{ paddingBottom: '30px' }}>
      {user?.role === 'citizen' ? (
        <div className="raise-header" style={{ margin: '0 -14px 12px -14px' }}>
          <div className="raise-back" onClick={() => navigate('/dashboard')}>
            <i className="ti ti-arrow-left" aria-hidden="true"></i>
            <span>{t.backBtn}</span>
          </div>
          <div className="raise-title">{t.navProfile}</div>
        </div>
      ) : (
        <div className="section-label">{t.navProfile}</div>
      )}
      
      {/* Header Profile Card */}
      <div className="card" style={{ textAlign: 'center', padding: '24px 14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%)'
        }} />

        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fffde7',
            border: '2.5px solid var(--gold)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <i className={user?.role === 'citizen' ? 'ti ti-user-circle' : 'ti ti-user'} style={{ fontSize: '38px', color: 'var(--gold-dark)' }} aria-hidden="true"></i>
        </div>
        <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
          {getTranslatedName()}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '3px' }}>
          {getTranslatedDesignation()}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {user?.role === 'citizen' ? (
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid #dbeafe',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <i className="ti ti-discount-check-filled" style={{ fontSize: '12px' }} aria-hidden="true"></i>
              {language === 'te' ? 'ధృవీకరించబడిన పౌరుడు' : 'Verified Citizen'}
            </span>
          ) : (
            <span
              style={{
                background: 'var(--gold-bg)',
                color: 'var(--gold-deep)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid var(--gold-border)',
              }}
            >
              {language === 'te' ? t.tdp : (user?.party || 'Telugu Desam Party')}
            </span>
          )}
          <span
            style={{
              background: 'var(--green-bg)',
              color: 'var(--green-text)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {language === 'te' ? t.active : (user?.status || 'Active')}
          </span>
        </div>
      </div>

      {/* Citizen Grievance Activity Summary */}
      {user?.role === 'citizen' && (
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            {language === 'te' ? 'నా సమస్యల వివరాలు' : 'My Grievance Summary'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{totalCount}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>{language === 'te' ? 'మొత్తం' : 'Total'}</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '10px 4px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>{resolvedCount}</div>
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>{language === 'te' ? 'పరిష్కారం' : 'Resolved'}</div>
            </div>
            <div style={{ background: '#fffde7', padding: '10px 4px', borderRadius: '10px', border: '1px solid #fef08a' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ca8a04' }}>{pendingCount}</div>
              <div style={{ fontSize: '10px', color: '#a16207', fontWeight: 700, marginTop: '2px' }}>{language === 'te' ? 'పెండింగ్' : 'Pending'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Info Card details */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: '#f4f4f4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className="ti ti-phone" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{t.phone}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
                {user?.phone || '+91 98765 43210'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: '#f4f4f4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className="ti ti-mail" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{t.email}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
                {user?.email || (user?.role === 'citizen' ? 'citizen.kuppam@ap.gov.in' : 'mla.kuppam@ap.gov.in')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: '#f4f4f4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className="ti ti-map-pin" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                {user?.role === 'citizen' ? (language === 'te' ? 'నివాస గ్రామం & ప్రాంతం' : 'Resident Village & Location') : t.constOffice}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
                {user?.role === 'citizen'
                  ? (user?.designation?.split(' · ')[1] || 'Kuppam Town') + (language === 'te' ? ', కుప్పం నియోజకవర్గం, చిత్తూరు' : ', Kuppam Constituency, Chittoor')
                  : t.officeAddress}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="card" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-language" style={{ color: '#2563eb', fontSize: '17px' }} aria-hidden="true"></i>
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {language === 'te' ? 'భాష ఎంపిక' : 'Language'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {language === 'te' ? 'తెలుగు / English' : 'English / Telugu'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', background: '#f3f4f6', padding: '3px', borderRadius: '8px', gap: '2px' }}>
            <button
              onClick={() => dispatch(setLanguage('en'))}
              style={{
                border: 'none',
                background: language === 'en' ? '#ffffff' : 'transparent',
                color: language === 'en' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              English
            </button>
            <button
              onClick={() => dispatch(setLanguage('te'))}
              style={{
                border: 'none',
                background: language === 'te' ? 'var(--gold-dark)' : 'transparent',
                color: language === 'te' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: language === 'te' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Logout / Sign Out Button Card */}
      <div 
        className="card" 
        style={{ 
          cursor: 'pointer', 
          background: '#fff5f5', 
          border: '1.5px solid #fecaca', 
          padding: '14px',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
          marginTop: '6px'
        }} 
        onClick={handleLogout}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: '#fee2e2',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className="ti ti-logout" style={{ fontSize: '19px', color: '#dc2626' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#dc2626' }}>{t.signOut}</div>
              <div style={{ fontSize: '10.5px', color: '#991b1b', marginTop: '1px' }}>
                {language === 'te' ? 'ఖాతా నుండి సురక్షితంగా నిష్క్రమించండి' : 'Securely sign out of your account'}
              </div>
            </div>
          </div>
          <i className="ti ti-chevron-right" style={{ color: '#dc2626', fontSize: '16px' }} aria-hidden="true"></i>
        </div>
      </div>

      <div style={{ height: '24px' }} />
    </div>
  );
};

export default Profile;
