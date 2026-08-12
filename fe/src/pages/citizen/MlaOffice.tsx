import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { bookCitizenAppointment } from '../../store/citizenSlice';
import { translations } from '../../i18n/translations';

const MlaOffice: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  // Appointment Form States
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !purpose) return;
    
    // Dispatch to Citizen Microservice API
    dispatch(bookCitizenAppointment({ date, purpose }));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setDate('');
      setPurpose('');
    }, 3000);
  };

  return (
    <div id="page-mla-office" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '20px' }}>
      
      {/* Header */}
      <div className="raise-header" style={{ margin: '0 -14px 14px -14px' }}>
        <div className="raise-back" onClick={() => navigate('/dashboard')}>
          <i className="ti ti-arrow-left" aria-hidden="true"></i>
          <span>{t.backBtn}</span>
        </div>
        <div className="raise-title">{t.mlaOfficeTitle}</div>
      </div>

      {/* MLA Profile Card */}
      <div className="card" style={{ padding: '20px 14px', position: 'relative', overflow: 'hidden' }}>
        {/* Background Accent Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(95deg, var(--gold) 0%, var(--gold-dark) 100%)'
        }} />
        
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* MLA Profile Photo Circle */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fffde7',
            border: '2.5px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            <i className="ti ti-user" style={{ fontSize: '30px', color: 'var(--gold-dark)' }} aria-hidden="true"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {language === 'te' ? 'శ్రీ ఎన్. చంద్రబాబు నాయుడు' : 'Sri N. Chandrababu Naidu'}
              </span>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                fontSize: '9.5px',
                fontWeight: '700',
                padding: '1px 5px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <i className="ti ti-discount-check-filled" style={{ fontSize: '10px' }} aria-hidden="true"></i>
                {language === 'te' ? 'ధృవీకరించబడింది' : 'VERIFIED'}
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
              {language === 'te' ? 'ఎమ్మెల్యే & ఆంధ్రప్రదేశ్ ముఖ్యమంత్రి' : 'MLA & Chief Minister of Andhra Pradesh'}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <span style={{
                background: 'var(--gold-bg)',
                color: 'var(--gold-deep)',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid var(--gold-border)'
              }}>
                {language === 'te' ? 'తెలుగుదేశం పార్టీ' : 'Telugu Desam Party'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Office Timings & Details Card */}
      <div className="card" style={{ padding: '16px 14px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
          {language === 'te' ? 'కార్యాలయ వివరాలు' : 'Office Information'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Timings */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-clock" style={{ color: '#dc2626', fontSize: '15px' }} aria-hidden="true"></i>
            </div>
            <div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{t.timingsLabel}</div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1px' }}>{t.timingsValue}</div>
            </div>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-map-pin" style={{ color: '#2563eb', fontSize: '15px' }} aria-hidden="true"></i>
            </div>
            <div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{t.officeAddressLabel}</div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1px', lineHeight: '1.4' }}>
                {t.officeAddress}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinators & Contacts Card */}
      <div className="card" style={{ padding: '16px 14px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
          {language === 'te' ? 'సంప్రదించవలసిన వ్యక్తులు' : 'Contacts & Liaisons'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Chief Liaison - Ravi Kumar (with profile icon beside his name) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '10px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff8e1', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-user-star" style={{ color: 'var(--gold-dark)', fontSize: '16px' }} aria-hidden="true"></i>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {t.coordinatorName}
                  </span>
                  {/* Profile icon beside name */}
                  <i className="ti ti-user-circle" style={{ color: 'var(--gold-dark)', fontSize: '14px' }} aria-hidden="true" />
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {t.officeCoordinator}
                </div>
              </div>
            </div>
            <a href="tel:+919876543210" style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <i className="ti ti-phone-call" style={{ color: '#15803d', fontSize: '14px' }} aria-hidden="true"></i>
            </a>
          </div>

          {/* Phone Helpline */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-phone" style={{ color: '#16a34a', fontSize: '15px' }} aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{t.phoneHelpline}</div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1px' }}>+91 85702 22001</div>
            </div>
            <a href="tel:+918570222001" className="see-all" style={{ textDecoration: 'none' }}>{language === 'te' ? 'కాల్ చేయి' : 'Call'}</a>
          </div>

          {/* Email Support */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fffde7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-mail" style={{ color: 'var(--gold-dark)', fontSize: '15px' }} aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{t.petitionEmail}</div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1px' }}>mla.kuppam@ap.gov.in</div>
            </div>
            <a href="mailto:mla.kuppam@ap.gov.in" className="see-all" style={{ textDecoration: 'none' }}>{language === 'te' ? 'మెయిల్' : 'Email'}</a>
          </div>
        </div>
      </div>

      {/* Appointment Scheduler Card */}
      <div className="card" style={{ padding: '16px 14px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
          {t.appointmentFormTitle}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {t.meetingDateLabel}
            </label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {t.purposeLabel}
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={t.meetingPurposePlaceholder}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                background: '#ffffff',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              marginTop: '4px'
            }}
          >
            {t.submitRequest}
          </button>
        </form>
      </div>

      {/* Appointment Success Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(17,17,17,0.92)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '24px',
          fontSize: '11.5px',
          fontWeight: '700',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {t.appointmentSuccess}
        </div>
      )}
    </div>
  );
};

export default MlaOffice;
