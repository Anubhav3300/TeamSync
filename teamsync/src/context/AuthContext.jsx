import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
  DEFAULT_USERS,
  authenticateUser,
  registerUser
} from '../data/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredSession() || null;
  });

  const isAuthenticated = !!currentUser;

  const login = (user, rememberMe = true) => {
    if (user) {
      setCurrentUser(user);
      saveStoredSession(user, rememberMe);
    }
  };

  const logout = () => {
    clearStoredSession();
    setCurrentUser(null);
  };

  const updateUser = (updatedFields) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      saveStoredSession(updated);
      return updated;
    });
  };

  const loginDemo = (userKey = 'rohan') => {
    let demoUser = DEFAULT_USERS[0];
    if (userKey === 'david') demoUser = DEFAULT_USERS[1];
    else if (userKey === 'elena') demoUser = DEFAULT_USERS[2];
    login(demoUser, true);
    return demoUser;
  };

  const handleAuthenticate = (email, password) => {
    const res = authenticateUser(email, password);
    if (res.success && res.user) {
      login(res.user);
    }
    return res;
  };

  const handleRegister = (userData) => {
    const res = registerUser(userData);
    if (res.success && res.user) {
      login(res.user);
    }
    return res;
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    updateUser,
    loginDemo,
    authenticate: handleAuthenticate,
    register: handleRegister
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
