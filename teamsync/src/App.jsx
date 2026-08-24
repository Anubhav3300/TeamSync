import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import DashboardLayout from './DashboardLayout';
import { getStoredSession, saveStoredSession, clearStoredSession, DEFAULT_USERS } from './data/authService';

/**
 * App Root Component
 * ----------------------------------------------------
 * Simple, clean React Root Component.
 * - Handles Page Navigation ('landing', 'auth', 'app')
 * - Persists Session across Browser Reloads
 * - Manages Theme Synchronization (Light / Dark)
 */
function App() {
  // Current logged in user object (restores saved session if exists)
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredSession() || null;
  });

  // Page state: if logged in session exists, stay in 'app' (workspace), otherwise show 'landing'
  const [pageState, setPageState] = useState(() => {
    const savedSession = getStoredSession();
    return savedSession ? 'app' : 'landing';
  });
  
  // Authentication mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');
  
  // Theme state: 'light' or 'dark' with persistence
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('teamsync_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Side effect: update data-theme on <html> root element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('teamsync_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Navigate to Auth page (Sign In or Sign Up)
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setPageState('auth');
  };

  // Handler when user logs in or registers (persists session)
  const handleLogin = (user) => {
    if (user) {
      setCurrentUser(user);
      saveStoredSession(user);
    }
    setPageState('app');
  };

  // Handler for demo workspace direct access from landing page
  const handleDemoAccess = () => {
    const demoUser = currentUser || DEFAULT_USERS[0];
    setCurrentUser(demoUser);
    saveStoredSession(demoUser);
    setPageState('app');
  };

  // Handler when user logs out (clears session and returns to landing)
  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setPageState('landing');
  };

  // 1. Landing Page View (when not logged in)
  if (pageState === 'landing') {
    return (
      <LandingPage
        onLogin={handleDemoAccess}
        onOpenAuth={handleOpenAuth}
      />
    );
  }

  // 2. Authentication View (Sign In / Sign Up)
  if (pageState === 'auth') {
    return (
      <AuthView
        key={authMode}
        initialMode={authMode}
        onLogin={handleLogin}
        onBackToLanding={() => setPageState('landing')}
      />
    );
  }

  // 3. Main Dashboard Workspace (when authenticated)
  return (
    <DashboardLayout
      currentUser={currentUser}
      setCurrentUser={(updatedUser) => {
        setCurrentUser(updatedUser);
        saveStoredSession(updatedUser);
      }}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    />
  );
}

export default App;
