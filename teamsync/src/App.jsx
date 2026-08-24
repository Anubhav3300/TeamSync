import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import DashboardLayout from './DashboardLayout';
import { initialCurrentUser } from './data/mockData';

/**
 * App Root Component
 * ----------------------------------------------------
 * Evaluation 1 Rubrics Implemented:
 * 1. Functional Components & JSX Architecture
 * 2. React State (useState) for page routing and user management
 * 3. React Side Effects (useEffect) for theme synchronization
 * 4. Props Passing to child components (LandingPage, AuthView, DashboardLayout)
 */
function App() {
  // Page state: 'landing' (public landing page) | 'auth' (login/register) | 'app' (main workspace)
  const [pageState, setPageState] = useState('landing');
  
  // Authentication mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');
  
  // Current logged in user object
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  // Side effect: update data-theme on <html> root element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Event handler to navigate to Auth page
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setPageState('auth');
  };

  // Event handler when user logs in
  const handleLogin = (user) => {
    if (user) {
      setCurrentUser(user);
    }
    setPageState('app');
  };

  // Event handler when user logs out (returns to landing page)
  const handleLogout = () => {
    setPageState('landing');
  };

  // Conditional Rendering based on pageState
  if (pageState === 'landing') {
    return (
      <LandingPage
        onLogin={() => setPageState('app')}
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
      setCurrentUser={setCurrentUser}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    />
  );
}

export default App;
