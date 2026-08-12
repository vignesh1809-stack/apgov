import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import PhoneFrame from './components/PhoneFrame';
import RouteLoadingFallback from './components/RouteLoadingFallback';

// Route Code-Splitting / Dynamic Imports for 100k DAU performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Map = lazy(() => import('./pages/mla/Map'));
const Issues = lazy(() => import('./pages/citizen/Issues'));
const Analytics = lazy(() => import('./pages/mla/Analytics'));
const Profile = lazy(() => import('./pages/mla/Profile'));
const NewsDetail = lazy(() => import('./pages/citizen/NewsDetail'));
const NewsList = lazy(() => import('./pages/citizen/NewsList'));
const MlaOffice = lazy(() => import('./pages/citizen/MlaOffice'));
const VillagesList = lazy(() => import('./pages/mla/VillagesList'));

const AppLayout: React.FC = () => {
  return (
    <PhoneFrame>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Outlet />
      </Suspense>
    </PhoneFrame>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<RouteLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
