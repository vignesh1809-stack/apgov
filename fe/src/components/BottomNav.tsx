import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../store';
import { translations } from '../i18n/translations';

const BottomNav: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const t = translations[language];

  const navItems = user?.role === 'citizen' ? [
    { path: '/dashboard', label: t.navHome, icon: 'ti ti-layout-dashboard' },
    { path: '/issues', label: t.navRaiseIssue, icon: 'ti ti-edit-circle' },
    { path: '/profile', label: t.navProfile, icon: 'ti ti-user' },
  ] : [
    { path: '/dashboard', label: t.navDashboard, icon: 'ti ti-layout-dashboard' },
    { path: '/map', label: t.navMap, icon: 'ti ti-map-pin' },
    { path: '/issues', label: t.navIssues, icon: 'ti ti-list-details' },
    { path: '/analytics', label: t.navAnalytics, icon: 'ti ti-chart-bar' },
    { path: '/profile', label: t.navProfile, icon: 'ti ti-user' },
  ];

  return (
    <div className="nav-floating-area">
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <i className={item.icon} aria-hidden={true}></i>
                <span>{item.label}</span>
                {isActive && <div className="nav-active-pip" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
