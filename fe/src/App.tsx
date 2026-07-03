import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import PhoneFrame from './components/PhoneFrame';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Map from './pages/mla/Map';
import Issues from './pages/citizen/Issues';
import Analytics from './pages/mla/Analytics';
import Profile from './pages/mla/Profile';
import NewsDetail from './pages/citizen/NewsDetail';
import NewsList from './pages/citizen/NewsList';
import MlaOffice from './pages/citizen/MlaOffice';
import VillagesList from './pages/mla/VillagesList';

const AppLayout: React.FC = () => {
  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Main Router */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<Map />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mla-office" element={<MlaOffice />} />
              <Route path="/villages" element={<VillagesList />} />
            </Route>
          </Route>
          
          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
