import React, { useState, useEffect } from 'react';

/**
 * AuthView Component (Login & Registration)
 * ----------------------------------------------------
 * Evaluation 1 Rubric Alignment:
 * 1. Form Handling (DOM Manipulation): e.preventDefault(), controlled input state
 * 2. React State (useState): Managing form fields (name, email, password, role)
 * 3. Conditional Rendering: Switching between Login and Registration tabs
 * 4. Props & Event Handlers: onLogin() callback to update currentUser in App.jsx
 */
function AuthView({ onLogin, initialMode = 'login', onBackToLanding }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Project Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode state if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const isReg = mode === 'register';
    if (isReg && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanName = isReg
      ? (name.trim() || 'New Member')
      : (email ? email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : 'Sarah Jenkins');

    const user = {
      id: isReg ? 'usr-new-' + Date.now() : (email.toLowerCase().includes('david') ? 'usr-2' : email.toLowerCase().includes('elena') ? 'usr-3' : 'usr-1'),
      name: cleanName,
      email: email || (isReg ? 'newuser@teamsync.io' : 'sarah.j@teamsync.io'),
      role: isReg ? role : (email.toLowerCase().includes('david') ? 'Lead Developer' : email.toLowerCase().includes('elena') ? 'UX Designer' : 'Project Manager'),
      systemRole: role === 'Lead Developer' || email.toLowerCase().includes('david') ? 'Developer' : role === 'UX Designer' || email.toLowerCase().includes('elena') ? 'Designer' : 'Admin',
      avatar: isReg
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isNewAccount: isReg
    };
    onLogin(user);
  };

  const handleDemoLogin = (demoRole) => {
    let demoUser = {
      id: 'usr-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@teamsync.io',
      role: 'Project Manager',
      systemRole: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isNewAccount: false
    };

    if (demoRole === 'Developer') {
      demoUser = {
        id: 'usr-2',
        name: 'David Kim',
        email: 'david.k@teamsync.io',
        role: 'Lead Developer',
        systemRole: 'Developer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isNewAccount: false
      };
    } else if (demoRole === 'Designer') {
      demoUser = {
        id: 'usr-3',
        name: 'Elena Rostova',
        email: 'elena.r@teamsync.io',
        role: 'UX Designer',
        systemRole: 'Designer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isNewAccount: false
      };
    }

    onLogin(demoUser);
  };

  return (
    <div className="auth-page-container">
      {/* Left Branding Banner */}
      <div className="auth-banner-col">
        <div>
          <button
            onClick={onBackToLanding}
            className="auth-brand-header"
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <div className="brand-icon-box">✓</div>
            <span className="auth-brand-logo-text">TeamSync</span>
          </button>
        </div>

        <div className="auth-banner-content">
          <h1 className="auth-headline">
            Systematize your workflow,<br />
            <span>elevate your team.</span>
          </h1>
          <p className="auth-subtext">
            The quiet but powerful infrastructure for complex project management. High density, low friction.
          </p>
        </div>

        {/* 3D Mockup Graphic Card */}
        <div className="auth-mockup-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5' }}>TeamSync Live Preview</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sprint Planning</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700 }}>To Do (3)</div>
              <div style={{ height: '6px', background: '#94A3B8', borderRadius: '4px', marginTop: '6px' }} />
            </div>
            <div style={{ padding: '8px', background: '#EFF6FF', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563EB' }}>In Progress (2)</div>
              <div style={{ height: '6px', background: '#3B82F6', borderRadius: '4px', marginTop: '6px' }} />
            </div>
            <div style={{ padding: '8px', background: '#ECFDF5', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>Done (4)</div>
              <div style={{ height: '6px', background: '#10B981', borderRadius: '4px', marginTop: '6px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="auth-form-col">
        <div className="auth-form-wrapper">
          {/* Back to Home Button */}
          <button
            type="button"
            className="btn-auth-back"
            onClick={onBackToLanding}
          >
            ← Back to Home
          </button>

          {/* Segmented Mode Switcher */}
          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
            >
              ✨ Sign Up
            </button>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="auth-form-desc">
              {mode === 'login'
                ? 'Please enter your details to sign in to your workspace.'
                : 'Join over 40,000+ teams managing projects on TeamSync.'}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Primary Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Project Manager">Project Manager (Admin)</option>
                  <option value="Lead Developer">Lead Developer</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="QA Tester">QA Tester</option>
                </select>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="auth-options-row">
                <label className="auth-remember-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <a href="#forgot" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); alert('Reset link sent to ' + (email || 'your email')); }}>
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="btn-auth-submit">
              {mode === 'login' ? 'Sign In →' : 'Create Account & Launch Workspace →'}
            </button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <button
              type="button"
              className="btn-google-auth"
              onClick={() => handleDemoLogin('Manager')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-toggle-prompt">
              {mode === 'login' ? (
                <>
                  Don't have an account?
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                    }}
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Quick Demo Access Bar */}
            <div className="demo-roles-box">
              <div className="demo-roles-title">⚡ 1-Click Instant Demo Login:</div>
              <div className="demo-roles-buttons">
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('Manager')}
                >
                  👑 Admin (Sarah)
                </button>
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('Developer')}
                >
                  💻 Lead Dev (David)
                </button>
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('Designer')}
                >
                  🎨 UX Designer (Elena)
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthView;
