import React from 'react';

const RouteLoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '280px',
        padding: '32px 16px',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '3px solid #fffde7',
          borderTopColor: '#CC9900',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
        Loading portal...
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RouteLoadingFallback;
