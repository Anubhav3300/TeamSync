import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import DashboardLayout from './DashboardLayout';
import { getStoredSession, saveStoredSession, clearStoredSession, DEFAULT_USERS } from './data/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredSession() || null;
  });

  const [pageState, setPageState] = useState(() => {
    const savedSession = getStoredSession();
    return savedSession ? 'app' : 'landing';
  });
  
  const [authMode, setAuthMode] = useState('login');
  
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('teamsync_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('teamsync_theme', theme);
    } catch (e) {}
  }, [theme]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setPageState('auth');
  };

  const handleLogin = (user) => {
    if (user) {
      setCurrentUser(user);
      saveStoredSession(user);
    }
    setPageState('app');
  };

  const handleDemoAccess = () => {
    const demoUser = currentUser || DEFAULT_USERS[0];
    setCurrentUser(demoUser);
    saveStoredSession(demoUser);
    setPageState('app');
  };

  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setPageState('landing');
  };

  if (pageState === 'landing') {
    return (
      <LandingPage
        onLogin={handleDemoAccess}
        onOpenAuth={handleOpenAuth}
      />
    );
  }

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
