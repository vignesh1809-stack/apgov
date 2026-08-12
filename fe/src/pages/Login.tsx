import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { setLanguage } from '../store/uiSlice';
import { translations } from '../i18n/translations';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  // Screen modes: 'mla' | 'citizen-splash' | 'citizen-phone' | 'citizen-otp' | 'citizen-loc' | 'field-officer' | 'coordinator'
  const [loginMode, setLoginMode] = useState<'mla' | 'citizen-splash' | 'citizen-phone' | 'citizen-otp' | 'citizen-loc' | 'field-officer' | 'coordinator'>('citizen-splash');

  // MLA form state
  const [constituency, setConstituency] = useState('Ramachandrapuram');
  const [mlaPhone, setMlaPhone] = useState('9999999999');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // Citizen form state
  const [citizenMobile, setCitizenMobile] = useState('7700000001');
  const [citizenName, setCitizenName] = useState('CitizenFirst1 CitizenLast1');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [otpVal, setOtpVal] = useState('483');
  
  // Location selection state
  const [selectedDistrict, setSelectedDistrict] = useState('Konaseema');
  const [selectedConstituency, setSelectedConstituency] = useState('Ramachandrapuram');
  const [selectedMandal, setSelectedMandal] = useState('Ramachandrapuram Mandal');
  const [selectedVillage, setSelectedVillage] = useState('Ramachandrapuram');

  // Field Officer form state
  const [employeeId, setEmployeeId] = useState('EMP-FO001');
  const [foOtpVal, setFoOtpVal] = useState('483');

  // Coordinator form state
  const [coordinatorId, setCoordinatorId] = useState('CO-KUP-001');
  const [coordinatorMandal, setCoordinatorMandal] = useState('Ramachandrapuram Mandal');
  const [coordinatorOtpVal, setCoordinatorOtpVal] = useState('483');

  const handleMlaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mlaPhone.trim()) {
      dispatch(loginFailure('Phone number is required.'));
      return;
    }

    if (!passcode) {
      dispatch(loginFailure(t.errorPasscodeRequired));
      return;
    }

    dispatch(loginStart());

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mlaPhone,
          passcode: passcode
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(loginSuccess({
          user: {
            name: data.name,
            constituency: data.constituency,
            designation: data.designation,
            party: data.party,
            status: data.status,
            email: data.email,
            phone: data.phone,
            role: data.role
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(data.error || t.errorInvalidPasscode));
      }
    } catch (err) {
      dispatch(loginFailure('Connection to security server failed'));
    }
  };

  const handleCitizenLoginComplete = async () => {
    if (!citizenMobile.trim()) return;
    dispatch(loginStart());

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: citizenMobile,
          otp: otpVal
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(loginSuccess({
          user: {
            name: data.name,
            constituency: data.constituency,
            designation: data.designation,
            party: data.party,
            status: data.status,
            email: data.email,
            phone: data.phone,
            role: data.role
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(data.error || 'Invalid OTP or phone number'));
      }
    } catch (err) {
      dispatch(loginFailure('Connection to security server failed'));
    }
  };

  const handleFieldOfficerLoginComplete = async () => {
    if (!employeeId.trim()) return;
    dispatch(loginStart());

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId,
          otp: foOtpVal
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(loginSuccess({
          user: {
            name: data.name,
            constituency: data.constituency,
            designation: data.designation,
            party: data.party,
            status: data.status,
            email: data.email,
            phone: data.phone,
            role: data.role
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(data.error || 'Invalid Employee ID or OTP'));
      }
    } catch (err) {
      dispatch(loginFailure('Connection to security server failed'));
    }
  };

  const handleCoordinatorLoginComplete = async () => {
    if (!coordinatorId.trim()) return;
    dispatch(loginStart());

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: coordinatorId,
          otp: coordinatorOtpVal
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(loginSuccess({
          user: {
            name: data.name,
            constituency: data.constituency,
            designation: data.designation,
            party: data.party,
            status: data.status,
            email: data.email,
            phone: data.phone,
            role: data.role
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(data.error || 'Invalid Coordinator ID or OTP'));
      }
    } catch (err) {
      dispatch(loginFailure('Connection to security server failed'));
    }
  };

  // Helper for language selector
  const renderLanguageSelector = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '12px 16px 0',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '20px',
        padding: '3px',
        gap: '2px',
        zIndex: 10
      }}>
        <button
          type="button"
          onClick={() => dispatch(setLanguage('en'))}
          style={{
            fontSize: '11px',
            fontWeight: language === 'en' ? '700' : '500',
            padding: '5px 12px',
            borderRadius: '16px',
            border: 'none',
            background: language === 'en' ? '#fff' : 'transparent',
            color: language === 'en' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: language === 'en' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => dispatch(setLanguage('te'))}
          style={{
            fontSize: '11px',
            fontWeight: language === 'te' ? '700' : '500',
            padding: '5px 12px',
            borderRadius: '16px',
            border: 'none',
            background: language === 'te' ? '#fff' : 'transparent',
            color: language === 'te' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: language === 'te' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          తెలుగు
        </button>
      </div>
    </div>
  );

  return (
    <div className="phone-wrap" style={{ background: '#fff' }}>
      <div className="phone-inner">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <i className="ti ti-signal-4g" aria-hidden="true"></i>
            <i className="ti ti-wifi" aria-hidden="true"></i>
            <i className="ti ti-battery-2" aria-hidden="true"></i>
          </div>
        </div>

        {renderLanguageSelector()}

        {/* 1. MLA LOGIN SCREEN */}
        {loginMode === 'mla' && (
          <div className="login-container" style={{ paddingTop: '20px' }}>
            <div className="login-logo">
              <i className="ti ti-building-bank" aria-hidden="true"></i>
            </div>

            <h1 className="login-title" style={{ background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-deep) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 4px', fontSize: '24px' }}>
              {t.loginTitle}
            </h1>
            <p className="login-subtitle">{t.loginSubtitle}</p>

            <form className="login-form" onSubmit={handleMlaSubmit}>
              <div className="form-group">
                <label htmlFor="constituency">{t.constituency}</label>
                <div className="input-with-icon">
                  <i className="ti ti-map-pin" aria-hidden="true" />
                  <select
                    id="constituency"
                    className="form-input"
                    style={{ paddingLeft: '38px', appearance: 'none' }}
                    value={constituency}
                    onChange={(e) => setConstituency(e.target.value)}
                  >
                    <option value="Kuppam">{t.kuppam} ({language === 'te' ? 'శ్రీ ఎన్. సి. నాయుడు' : 'Sri N. C. Naidu'})</option>
                    <option value="Ramagiri">{t.ramagiri}</option>
                    <option value="Gudupalli">{t.gudupalli}</option>
                    <option value="Venkatapur">{t.venkatapur}</option>
                    <option value="Bethampudi">{t.bethampudi}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mlaPhone">{t.mobileLabel}</label>
                <div className="input-with-icon">
                  <i className="ti ti-device-mobile" aria-hidden="true" />
                  <input
                    id="mlaPhone"
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="99999 99999"
                    value={mlaPhone}
                    onChange={(e) => setMlaPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="passcode">{t.securePasscode}</label>
                <div className="input-with-icon">
                  <i className="ti ti-lock" aria-hidden="true" />
                  <input
                    id="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    className="form-input"
                    placeholder={t.passcodePlaceholder}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <i className={showPasscode ? 'ti ti-eye-off' : 'ti ti-eye'} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? t.authenticating : t.secureLogin}
              </button>
            </form>

            {/* Quick-start helper */}
            <div
              style={{
                marginTop: '30px',
                padding: '12px 14px',
                background: 'rgba(255, 215, 0, 0.08)',
                border: '1px dashed var(--gold-border)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'var(--gold-deep)',
                lineHeight: '1.4',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                <i className="ti ti-info-circle" style={{ marginRight: '4px' }} />
                {t.devCredentials}
              </div>
              {t.devHelperText}
            </div>

            {/* Switch Link */}
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px' }}>
              {t.citizenLoginLink.split('? ')[0]}?{' '}
              <span
                style={{ color: 'var(--gold-deep)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setLoginMode('citizen-splash')}
              >
                {t.citizenLoginLink.split('? ')[1] || 'Login here'}
              </span>
            </div>
          </div>
        )}

        {/* 2. CITIZEN SPLASH SCREEN */}
        {loginMode === 'citizen-splash' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: 'calc(100% - 70px)', padding: '10px 24px 24px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, overflowY: 'auto' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#FFD700', border: '3px solid #CC9900',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '20px 0 16px'
              }}>
                <i className="ti ti-building-community" style={{ fontSize: '32px', color: '#663300' }} aria-hidden="true" />
              </div>
              
              <h1 className="login-title" style={{ background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-deep) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 2px', fontSize: '24px', fontWeight: '700' }}>
                AP Jana Seva
              </h1>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#CC9900', marginBottom: '8px' }}>ఆంధ్రప్రదేశ్ జనసేవ</div>
              <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', lineHeight: '1.5', margin: '0 0 20px' }}>
                {t.citizenSlogan}
              </p>

              {/* Slogan illustration */}
              <div style={{
                width: '180px', height: '110px', background: '#fffde7', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ffe082',
                marginBottom: '20px'
              }}>
                <i className="ti ti-speakerphone" style={{ fontSize: '56px', color: '#CC9900' }} aria-hidden="true" />
              </div>

              {/* KPI metrics */}
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <div style={{ flex: 1, background: '#fffde7', border: '1px solid #ffe082', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#CC9900' }}>1,248</div>
                  <div style={{ fontSize: '9px', color: '#996600', fontWeight: '600', marginTop: '2px' }}>{t.issuesRaised}</div>
                </div>
                <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>876</div>
                  <div style={{ fontSize: '9px', color: '#166534', fontWeight: '600', marginTop: '2px' }}>{t.issuesSolvedText}</div>
                </div>
                <div style={{ flex: 1, background: '#f8f8f8', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>175</div>
                  <div style={{ fontSize: '9px', color: '#888', fontWeight: '600', marginTop: '2px' }}>{t.villagesText}</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="login-btn" 
                onClick={() => setLoginMode('citizen-phone')} 
                style={{ 
                  width: '100%', 
                  padding: '13px 14px', 
                  background: 'linear-gradient(90deg, #FFD700 0%, #FFC107 100%)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: '#663300', 
                  fontSize: '13.5px', 
                  fontWeight: '800', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 3px 10px rgba(255, 215, 0, 0.3)'
                }}
              >
                <i className="ti ti-device-mobile" aria-hidden="true" style={{ fontSize: '17px' }}></i>
                {t.loginMobileBtn}
              </button>
              
              <button className="login-btn" onClick={() => setLoginMode('field-officer')} style={{ width: '100%', padding: '11px 14px', background: '#fff', border: '1.5px solid #FFD700', borderRadius: '16px', color: '#CC9900', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: '15px', marginRight: '6px', verticalAlign: '-1px' }}></i>
                {t.fieldOfficerLoginBtn}
              </button>
              
              <button className="login-btn" onClick={() => setLoginMode('coordinator')} style={{ width: '100%', padding: '11px 14px', background: '#fff', border: '1.5px solid #FFD700', borderRadius: '16px', color: '#CC9900', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <i className="ti ti-users" aria-hidden="true" style={{ fontSize: '15px', marginRight: '6px', verticalAlign: '-1px' }}></i>
                {t.coordinatorLoginBtn}
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', marginTop: '14px' }}>
                {t.mlaLoginLink.split('? ')[0]}?{' '}
                <span style={{ color: '#CC9900', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLoginMode('mla')}>
                  {t.mlaLoginLink.split('? ')[1]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. CITIZEN PHONE ENTRY SCREEN */}
        {loginMode === 'citizen-phone' && (
          <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="back-row" onClick={() => setLoginMode('citizen-splash')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '18px' }}>
                <i className="ti ti-arrow-left" style={{ fontSize: '18px', color: '#111' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.back}</span>
              </div>

              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#FFD700', border: '2.5px solid #CC9900',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <i className="ti ti-device-mobile" style={{ fontSize: '20px', color: '#663300' }} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', lineHeight: '1.3' }}>
                {t.enterMobileTitle}
              </h2>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '4px', lineHeight: '1.4' }}>
                {t.mobileSubtitle}
              </p>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t.mobileLabel}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ background: '#f8f8f8', border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: '600', color: '#111' }}>
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="98765 43210"
                      value={citizenMobile}
                      onChange={(e) => setCitizenMobile(e.target.value)}
                      style={{ flex: 1, padding: '12px 14px', background: '#fffde7', borderColor: '#FFD700' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t.fullNameLabel}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t.fullNamePlaceholder}
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', marginTop: '6px', cursor: 'pointer' }} onClick={() => setTermsAgreed(!termsAgreed)}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '5px',
                    background: termsAgreed ? '#FFD700' : '#f0f0f0',
                    border: '1.5px solid #ffe082',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px'
                  }}>
                    {termsAgreed && <i className="ti ti-check" style={{ fontSize: '11px', color: '#663300' }}></i>}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888', lineHeight: '1.4' }}>
                    {t.termsText.split(' Terms of Service')[0]} <span style={{ color: '#CC9900', fontWeight: '600' }}>Terms of Service</span> and <span style={{ color: '#CC9900', fontWeight: '600' }}>Privacy Policy</span> of AP Jana Seva.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                className="login-btn"
                onClick={() => setLoginMode('citizen-otp')}
                disabled={!termsAgreed || !citizenMobile.trim()}
                style={{
                  width: '100%', padding: '13px 14px', background: '#FFD700', border: 'none',
                  borderRadius: '16px', color: '#663300', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {t.sendOtpBtn} <i className="ti ti-arrow-right" style={{ fontSize: '14px' }} />
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', marginTop: '12px' }}>
                <i className="ti ti-lock" style={{ fontSize: '12px', marginRight: '3px', verticalAlign: '-1px' }} />
                {t.secureDataText}
              </div>
            </div>
          </div>
        )}

        {/* 4. CITIZEN OTP VERIFY SCREEN */}
        {loginMode === 'citizen-otp' && (
          <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="back-row" onClick={() => setLoginMode('citizen-phone')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '18px' }}>
                <i className="ti ti-arrow-left" style={{ fontSize: '18px', color: '#111' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.back}</span>
              </div>

              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: '#fffde7', border: '1.5px solid #ffe082',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <i className="ti ti-message-2-check" style={{ fontSize: '26px', color: '#CC9900' }} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', lineHeight: '1.3' }}>
                {t.verifyOtpTitle}
              </h2>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '4px', lineHeight: '1.4' }}>
                {t.otpSentTo} <strong>+91 {citizenMobile || '98765 43210'}</strong>
              </p>

              {/* OTP Input Boxes */}
              <div style={{ position: 'relative' }}>
                <div className="otp-boxes" style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const char = otpVal[index] || '';
                    const isActive = index === otpVal.length;
                    return (
                      <div
                        key={index}
                        className={`otp-box ${char ? 'filled' : ''} ${isActive ? 'active' : ''}`}
                        style={{
                          flex: 1,
                          height: '50px',
                          background: isActive ? '#fffde7' : '#f8f8f8',
                          border: isActive ? '2px solid #FFD700' : char ? '1.5px solid #FFD700' : '1.5px solid #f0f0f0',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#663300',
                        }}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                {/* Hidden Input box */}
                <input
                  type="text"
                  maxLength={6}
                  value={otpVal}
                  onChange={(e) => setOtpVal(e.target.value.replace(/\D/g, ''))}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50px',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  autoFocus
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginBottom: '20px' }}>
                {t.resendOtpText} <span style={{ color: '#CC9900', fontWeight: '600' }}>00:42</span>
              </div>
            </div>

            <div>
              <button
                className="login-btn"
                onClick={() => setLoginMode('citizen-loc')}
                disabled={otpVal.length < 6}
                style={{
                  width: '100%', padding: '13px 14px', background: '#FFD700', border: 'none',
                  borderRadius: '16px', color: '#663300', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  marginBottom: '12px'
                }}
              >
                {t.verifyContinueBtn} <i className="ti ti-arrow-right" style={{ fontSize: '14px' }} />
              </button>

              {/* Informative alerts */}
              <div style={{ background: '#fffde7', border: '1px solid #ffe082', borderRadius: '14px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                <i className="ti ti-shield-check" style={{ fontSize: '16px', color: '#CC9900', flexShrink: 0, marginTop: '1px' }}></i>
                <div style={{ fontSize: '10px', color: '#996600', lineHeight: '1.4' }}>
                  {t.otpConfidentialText}
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-device-mobile-check" style={{ fontSize: '16px', color: '#16a34a', flexShrink: 0 }}></i>
                <div style={{ fontSize: '10px', color: '#166534', lineHeight: '1.4' }}>
                  {t.autoReadSmsText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CITIZEN LOCATION SELECTION SCREEN */}
        {loginMode === 'citizen-loc' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', background: '#f8f8f8', justifyContent: 'space-between' }}>
            <div style={{ background: '#fff', padding: '12px 18px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
              <div 
                className="back-row" 
                onClick={() => setLoginMode('citizen-otp')} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '10px' }}
              >
                <i className="ti ti-arrow-left" style={{ fontSize: '18px', color: '#111' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.back}</span>
              </div>
              <div style={{ fontSize: '9px', color: '#bbb', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t.stepProgress}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>
                {t.selectLocationTitle}
              </div>
              <div className="telugu-sub" style={{ fontSize: '11px', marginTop: '2px' }}>
                {language === 'te' ? 'మీ స్థానం ఎంచుకోండి' : 'Choose your resident village'}
              </div>
              <div className="progress-bar" style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                <div className="prog-dot done" style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#FFD700' }}></div>
                <div className="prog-dot done" style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#FFD700' }}></div>
                <div className="prog-dot active" style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#CC9900' }}></div>
                <div className="prog-dot" style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#f0f0f0' }}></div>
                <div className="prog-dot" style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#f0f0f0' }}></div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Step 1: District */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#663300' }}>
                    1
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{t.districtLabel}</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-input"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{ width: '100%', appearance: 'none', background: '#fffde7', borderColor: '#FFD700', padding: '10px 12px', fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="Chittoor">{language === 'te' ? 'చిత్తూరు' : 'Chittoor'}</option>
                    <option value="Nellore">{language === 'te' ? 'నెల్లూరు' : 'Nellore'}</option>
                  </select>
                  <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#CC9900' }}></i>
                </div>
              </div>

              {/* Step 2: Constituency */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#663300' }}>
                    2
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{t.constituencyLabel}</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-input"
                    value={selectedConstituency}
                    onChange={(e) => {
                      setSelectedConstituency(e.target.value);
                      setSelectedVillage(e.target.value); // Sync pre-selected village
                    }}
                    style={{ width: '100%', appearance: 'none', background: '#fffde7', borderColor: '#FFD700', padding: '10px 12px', fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="Kuppam">{t.kuppam}</option>
                    <option value="Ramagiri">{t.ramagiri}</option>
                    <option value="Gudupalli">{t.gudupalli}</option>
                    <option value="Venkatapur">{t.venkatapur}</option>
                    <option value="Bethampudi">{t.bethampudi}</option>
                  </select>
                  <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#CC9900' }}></i>
                </div>
              </div>

              {/* Step 3: Mandal */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#663300' }}>
                    3
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{t.mandalLabel}</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-input"
                    value={selectedMandal}
                    onChange={(e) => setSelectedMandal(e.target.value)}
                    style={{ width: '100%', appearance: 'none', padding: '10px 12px', fontSize: '13px' }}
                  >
                    <option value="Select mandal...">{t.mandalPlaceholder}</option>
                    <option value="Kuppam Mandal">{selectedConstituency} {language === 'te' ? 'మండలం' : 'Mandal'}</option>
                  </select>
                  <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}></i>
                </div>
                <div style={{ fontSize: '9px', color: '#bbb', marginTop: '5px', paddingLeft: '2px' }}>
                  {t.mandalHint}
                </div>
              </div>

              {/* Step 4: Village */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#663300' }}>
                    4
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{t.citizenVillageLabel}</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-input"
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    style={{ width: '100%', appearance: 'none', padding: '10px 12px', fontSize: '13px' }}
                  >
                    <option value="Select village...">{t.villagePlaceholder}</option>
                    <option value="Kuppam">{t.kuppam}</option>
                    <option value="Ramagiri">{t.ramagiri}</option>
                    <option value="Gudupalli">{t.gudupalli}</option>
                    <option value="Venkatapur">{t.venkatapur}</option>
                    <option value="Bethampudi">{t.bethampudi}</option>
                  </select>
                  <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}></i>
                </div>
              </div>

              {/* Helper badge */}
              <div style={{ background: '#fffde7', border: '1px solid #ffe082', borderRadius: '14px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="ti ti-map-pin" style={{ fontSize: '18px', color: '#CC9900', flexShrink: 0 }}></i>
                <div style={{ fontSize: '10px', color: '#996600', lineHeight: '1.4' }}>
                  {t.locSloganText}
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 16px 18px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
              {error && (
                <div className="login-error" style={{ marginBottom: '12px', padding: '8px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <button
                className="login-btn"
                onClick={handleCitizenLoginComplete}
                disabled={selectedMandal === 'Select mandal...' || selectedVillage === 'Select village...'}
                style={{
                  width: '100%', padding: '13px 14px', background: '#FFD700', border: 'none',
                  borderRadius: '16px', color: '#663300', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  marginTop: 0
                }}
              >
                {t.continueDashboardBtn} <i className="ti ti-arrow-right" style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>
        )}

        {/* 6. FIELD OFFICER LOGIN SCREEN */}
        {loginMode === 'field-officer' && (
          <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="back-row" onClick={() => setLoginMode('citizen-splash')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '18px' }}>
                <i className="ti ti-arrow-left" style={{ fontSize: '18px', color: '#111' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.back}</span>
              </div>

              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#FFD700', border: '3px solid #CC9900',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: '14px'
              }}>
                <i className="ti ti-shield-check" style={{ fontSize: '32px', color: '#663300' }} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', textAlign: 'center', letterSpacing: '-0.5px' }}>
                {t.loginTitle}
              </h2>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#CC9900', textAlign: 'center', marginTop: '2px' }}>
                {t.fieldOfficerLoginBtn}
              </div>
              <div style={{
                display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '5px',
                background: '#FFD700', borderRadius: '20px', padding: '4px 14px', marginTop: '10px',
                fontSize: '11px', fontWeight: '800', color: '#663300'
              }}>
                <i className="ti ti-id-badge" style={{ fontSize: '13px' }}></i>{t.fieldOfficerLoginBtn}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.employeeIdLabel}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: '#fffde7', border: '1.5px solid #FFD700', borderRadius: '14px', padding: '14px 13px', fontSize: '13px', fontWeight: '800', color: '#996600', flexShrink: 0 }}>
                      AP·GOV
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={t.employeeIdPlaceholder}
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      style={{ flex: 1, padding: '14px 16px', background: '#f8f8f8', border: '1.5px solid #f0f0f0', borderRadius: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.assignedZoneLabel}
                  </div>
                  <div style={{ background: '#fffde7', border: '1.5px solid #FFD700', borderRadius: '14px', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <i className="ti ti-map-pin" style={{ fontSize: '19px', color: '#CC9900' }} aria-hidden="true" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#663300' }}>{t.assignedZoneValue}</div>
                      <div style={{ fontSize: '10px', color: '#996600', marginTop: '1px' }}>{t.assignedZoneSubtitle}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.otpVerificationLabel}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div className="otp-boxes" style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const char = foOtpVal[index] || '';
                        const isActive = index === foOtpVal.length;
                        return (
                          <div
                            key={index}
                            className={`otp-box ${char ? 'filled' : ''} ${isActive ? 'active' : ''}`}
                            style={{
                              flex: 1,
                              height: '50px',
                              background: isActive ? '#fffde7' : char ? '#fffde7' : '#f8f8f8',
                              border: isActive ? '2px solid #FFD700' : char ? '1.5px solid #FFD700' : '1.5px solid #f0f0f0',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#663300',
                            }}
                          >
                            {char}
                          </div>
                        );
                      })}
                    </div>
                    {/* Hidden Input box */}
                    <input
                      type="text"
                      maxLength={6}
                      value={foOtpVal}
                      onChange={(e) => setFoOtpVal(e.target.value.replace(/\D/g, ''))}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50px',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
                  {t.didNotGetOtp} <strong style={{ color: '#CC9900', cursor: 'pointer' }}>{t.resendIn} 0:38</strong>
                </div>
              </div>
            </div>

            <div>
              {error && (
                <div className="login-error" style={{ marginBottom: '12px', padding: '8px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <button
                className="btn-gold"
                onClick={handleFieldOfficerLoginComplete}
                disabled={foOtpVal.length < 6 || !employeeId.trim()}
                style={{
                  width: '100%', padding: '15px', background: '#FFD700', border: 'none',
                  borderRadius: '16px', color: '#663300', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {t.verifyGoToDashboard}
                <i className="ti ti-arrow-right" style={{ fontSize: '14px', verticalAlign: '-2px', marginLeft: '6px' }} />
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <i className="ti ti-lock" style={{ fontSize: '13px' }} />{t.securedBySso}
              </div>
            </div>
          </div>
        )}

        {/* 7. MANDAL COORDINATOR LOGIN SCREEN */}
        {loginMode === 'coordinator' && (
          <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="back-row" onClick={() => setLoginMode('citizen-splash')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '18px' }}>
                <i className="ti ti-arrow-left" style={{ fontSize: '18px', color: '#111' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.back}</span>
              </div>

              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#FFD700', border: '3px solid #CC9900',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: '14px'
              }}>
                <i className="ti ti-users" style={{ fontSize: '32px', color: '#663300' }} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', textAlign: 'center', letterSpacing: '-0.5px' }}>
                {t.loginTitle}
              </h2>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#CC9900', textAlign: 'center', marginTop: '2px' }}>
                {t.coordinatorLoginBtn}
              </div>
              <div style={{
                display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '5px',
                background: '#FFD700', borderRadius: '20px', padding: '4px 14px', marginTop: '10px',
                fontSize: '11px', fontWeight: '800', color: '#663300'
              }}>
                <i className="ti ti-id-badge" style={{ fontSize: '13px' }}></i>{t.coordinatorLoginBtn}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.coordinatorIdLabel}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: '#fffde7', border: '1.5px solid #FFD700', borderRadius: '14px', padding: '14px 13px', fontSize: '13px', fontWeight: '800', color: '#996600', flexShrink: 0 }}>
                      AP·CO
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={t.coordinatorIdPlaceholder}
                      value={coordinatorId}
                      onChange={(e) => setCoordinatorId(e.target.value)}
                      style={{ flex: 1, padding: '14px 16px', background: '#f8f8f8', border: '1.5px solid #f0f0f0', borderRadius: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.assignedMandalLabel}
                  </div>
                  <div style={{ background: '#fffde7', border: '1.5px solid #FFD700', borderRadius: '14px', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <i className="ti ti-map-pin" style={{ fontSize: '19px', color: '#CC9900' }} aria-hidden="true" />
                    <div style={{ flex: 1 }}>
                      <select
                        value={coordinatorMandal}
                        onChange={(e) => setCoordinatorMandal(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#663300',
                          outline: 'none',
                          padding: 0,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Kuppam Mandal">{t.kuppam} {language === 'te' ? 'మండలం' : 'Mandal'}</option>
                        <option value="Gudupalli Mandal">{t.gudupalli} {language === 'te' ? 'మండలం' : 'Mandal'}</option>
                        <option value="Ramagiri Mandal">{t.ramagiri} {language === 'te' ? 'మండలం' : 'Mandal'}</option>
                      </select>
                      <div style={{ fontSize: '10px', color: '#996600', marginTop: '1px' }}>{t.assignedZoneSubtitle}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="field-label" style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: '7px' }}>
                    {t.otpVerificationLabel}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div className="otp-boxes" style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const char = coordinatorOtpVal[index] || '';
                        const isActive = index === coordinatorOtpVal.length;
                        return (
                          <div
                            key={index}
                            className={`otp-box ${char ? 'filled' : ''} ${isActive ? 'active' : ''}`}
                            style={{
                              flex: 1,
                              height: '50px',
                              background: isActive ? '#fffde7' : char ? '#fffde7' : '#f8f8f8',
                              border: isActive ? '2px solid #FFD700' : char ? '1.5px solid #FFD700' : '1.5px solid #f0f0f0',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#663300',
                            }}
                          >
                            {char}
                          </div>
                        );
                      })}
                    </div>
                    {/* Hidden Input box */}
                    <input
                      type="text"
                      maxLength={6}
                      value={coordinatorOtpVal}
                      onChange={(e) => setCoordinatorOtpVal(e.target.value.replace(/\D/g, ''))}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50px',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
                  {t.didNotGetOtp} <strong style={{ color: '#CC9900', cursor: 'pointer' }}>{t.resendIn} 0:42</strong>
                </div>
              </div>
            </div>

            <div>
              {error && (
                <div className="login-error" style={{ marginBottom: '12px', padding: '8px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <button
                className="btn-gold"
                onClick={handleCoordinatorLoginComplete}
                disabled={coordinatorOtpVal.length < 6 || !coordinatorId.trim()}
                style={{
                  width: '100%', padding: '15px', background: '#FFD700', border: 'none',
                  borderRadius: '16px', color: '#663300', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {t.verifyGoToDashboard}
                <i className="ti ti-arrow-right" style={{ fontSize: '14px', verticalAlign: '-2px', marginLeft: '6px' }} />
              </button>

              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(255, 215, 0, 0.05)',
                  border: '1px dashed var(--gold-border)',
                  borderRadius: '12px',
                  fontSize: '10px',
                  color: 'var(--gold-deep)',
                  textAlign: 'center',
                }}
              >
                <strong>{t.demoCredentialsLabel}:</strong> ID: <code>CO-KUP-001</code> | OTP: <code>483</code>
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <i className="ti ti-lock" style={{ fontSize: '13px' }} />{t.securedBySso}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
