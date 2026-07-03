import React from 'react';
import type { FieldOfficer } from '../types';
import COPageHeader from '../components/COPageHeader';
import COFieldOfficerCard from '../components/COFieldOfficerCard';

interface COFieldOfficersProps {
  fieldOfficers: FieldOfficer[];
  expandedFoId: string | null;
  setExpandedFoId: (id: string | null) => void;
  onScreenChange: (screen: 'home' | 'assign' | 'select' | 'fos' | 'detail' | 'reports', id?: string) => void;
  t: any;
  language: string;
}

const COFieldOfficers: React.FC<COFieldOfficersProps> = ({
  fieldOfficers,
  expandedFoId,
  setExpandedFoId,
  onScreenChange,
  t,
  language
}) => {
  const isTelugu = language === 'te';

  const availableCount = fieldOfficers.filter(fo => fo.status === 'Available').length;
  const busyCount = fieldOfficers.filter(fo => fo.status === 'Busy').length;
  const overloadedCount = fieldOfficers.filter(fo => fo.status === 'Overloaded').length;

  return (
    <div className="screen on" id="s-fos" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F5F5' }}>
      <COPageHeader
        title={t.fieldOfficers}
        subTitle={isTelugu ? `${fieldOfficers.length} అధికారులు · కుప్పం మండలం` : `${fieldOfficers.length} officers · Kuppam Mandal`}
        onBack={() => onScreenChange('home')}
        backLabel={t.navHome}
      >
        <div className="mc"><i className="ti ti-map-pin"></i>{isTelugu ? 'కుప్పం మండలం' : 'Kuppam Mandal'}</div>
      </COPageHeader>

      {/* Load indicator counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '10px 14px', borderBottom: '1px solid var(--brd)', background: 'var(--w)', flexShrink: 0 }}>
        <div style={{ background: 'var(--surf)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--grn)' }}>
            {availableCount}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.availableStatus}</div>
        </div>
        <div style={{ background: 'var(--surf)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ora)' }}>
            {busyCount}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.busyStatus}</div>
        </div>
        <div style={{ background: 'var(--surf)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--red)' }}>
            {overloadedCount}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.overloadedStatus}</div>
        </div>
      </div>

      <div className="scrl" style={{ padding: '10px 14px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fieldOfficers.map(fo => {
            const isExpanded = expandedFoId === fo.id;
            return (
              <COFieldOfficerCard
                key={fo.id}
                fo={fo}
                language={language}
                t={t}
                isExpanded={isExpanded}
                onToggleExpand={() => setExpandedFoId(isExpanded ? null : fo.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default COFieldOfficers;
