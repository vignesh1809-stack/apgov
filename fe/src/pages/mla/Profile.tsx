import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { translations } from '../../i18n/translations';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  const getTranslatedMlaName = (name: string | undefined) => {
    if (!name) return language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu';
    if (name === 'Sri N. Chandrababu Naidu') {
      return language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu';
    }
    return name;
  };

  const getTranslatedDesignation = (designation: string | undefined) => {
    if (!designation) return language === 'te' ? 'పౌరుడు' : 'Citizen';
    if (designation === 'MLA & Chief Minister of Andhra Pradesh') {
      return language === 'te' ? 'ఎమ్మెల్యే & ఆంధ్రప్రదేశ్ ముఖ్యమంత్రి' : 'MLA & Chief Minister of Andhra Pradesh';
    }
    if (designation.includes('Citizen')) {
      const parts = designation.split(' · ');
      const villageName = parts[1] || 'Kuppam';
      const translatedVillage = villageName === 'Kuppam' ? t.kuppam : villageName === 'Ramagiri' ? t.ramagiri : villageName === 'Gudupalli' ? t.gudupalli : villageName === 'Venkatapur' ? t.venkatapur : villageName === 'Bethampudi' ? t.bethampudi : villageName;
      return `${language === 'te' ? 'పౌరుడు' : 'Citizen'} · ${translatedVillage}`;
    }
    return designation;
  };

  const handleLogout = () => {
    if (window.confirm(t.confirmSignOut)) {
      dispatch(logout());
    }
  };

  return (
    <div id="page-profile">
      {user?.role === 'citizen' ? (
        <div className="raise-header" style={{ margin: '0 -14px 10px -14px' }}>
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
      <div className="card" style={{ textAlign: 'center', padding: '24px 14px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fffde7',
            border: '2px solid var(--gold)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <i className="ti ti-user" style={{ fontSize: '34px', color: 'var(--gold-dark)' }} aria-hidden="true"></i>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {getTranslatedMlaName(user?.name)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
          {getTranslatedDesignation(user?.designation)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {user?.role !== 'citizen' && (
            <span
              style={{
                background: 'var(--gold-bg)',
                color: 'var(--gold-deep)',
                fontSize: '11px',
                fontWeight: 600,
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
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {language === 'te' ? t.active : (user?.status || 'Active')}
          </span>
        </div>
      </div>

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
              }}
            >
              <i className="ti ti-phone" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.phone}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
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
              }}
            >
              <i className="ti ti-mail" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.email}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.email || 'mla.kuppam@ap.gov.in'}
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
              }}
            >
              <i className="ti ti-map" style={{ fontSize: '17px', color: 'var(--text-muted)' }} aria-hidden="true"></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {user?.role === 'citizen' ? (language === 'te' ? 'నా నివాస ప్రాంతం' : 'My Location') : t.constOffice}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.role === 'citizen' ? (user?.designation?.split(' · ')[1] || 'Kuppam') + (language === 'te' ? ', చిత్తూరు జిల్లా, ఆంధ్రప్రదేశ్' : ', Chittoor District, AP') : t.officeAddress}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Card */}
      <div className="card" style={{ cursor: 'pointer' }} onClick={handleLogout}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#fef2f2',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: '17px', color: 'var(--red)' }} aria-hidden="true"></i>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--red)' }}>{t.signOut}</div>
        </div>
      </div>
      <div style={{ height: '8px' }} />
    </div>
  );
};

export default Profile;
