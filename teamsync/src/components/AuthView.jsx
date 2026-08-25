import React, { useState, useEffect } from 'react';
import { authenticateUser, registerUser, DEFAULT_USERS } from '../data/authService';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  LogIn,
  UserPlus,
  Zap,
  Sparkles,
  ShieldCheck,
  Code2,
  Palette,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Shield
} from 'lucide-react';

function AuthView({ onLogin, initialMode = 'login', onBackToLanding }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Project Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'register') {
      const result = registerUser({ name, email, password, role });
      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      setSuccessMsg('Account created successfully! Launching workspace...');
      setTimeout(() => {
        onLogin(result.user, rememberMe);
      }, 500);
    } else {
      const result = authenticateUser(email, password);
      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      setSuccessMsg('Signed in successfully! Loading workspace...');
      setTimeout(() => {
        onLogin(result.user, rememberMe);
      }, 400);
    }
  };

  const handleDemoLogin = (userKey) => {
    setErrorMsg('');
    setSuccessMsg('');
    let demoUser = DEFAULT_USERS[0];
    if (userKey === 'david') {
      demoUser = DEFAULT_USERS[1];
    } else if (userKey === 'elena') {
      demoUser = DEFAULT_USERS[2];
    }
    onLogin(demoUser, rememberMe);
  };

  const handleFillDemoCredentials = (demoUser) => {
    setErrorMsg('');
    setSuccessMsg('');
    setMode('login');
    setEmail(demoUser.email);
    setPassword(demoUser.password);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-banner-col">
        <div>
          <button
            onClick={onBackToLanding}
            className="auth-brand-header"
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <div className="brand-icon-box">
              <Check size={18} strokeWidth={3} />
            </div>
            <span className="auth-brand-logo-text">TeamSync</span>
          </button>
        </div>

        <div className="auth-banner-content">
          <h1 className="auth-headline">
            Systematize your workflow,<br />
            <span>elevate your team.</span>
          </h1>
          <p className="auth-subtext">
            The modern workspace for sprint planning, task tracking, and seamless team collaboration.
          </p>
        </div>

        <div className="auth-mockup-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={14} />
              <span>Real-time Workspace</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sprint 12 Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700 }}>To Do (3)</div>
              <div style={{ height: '6px', background: '#94A3B8', borderRadius: '4px', marginTop: '6px' }} />
            </div>
            <div style={{ padding: '8px', background: '#EFF6FF', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563EB' }}>In Progress (4)</div>
              <div style={{ height: '6px', background: '#3B82F6', borderRadius: '4px', marginTop: '6px' }} />
            </div>
            <div style={{ padding: '8px', background: '#ECFDF5', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>Done (8)</div>
              <div style={{ height: '6px', background: '#10B981', borderRadius: '4px', marginTop: '6px' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-form-wrapper">
          <button
            type="button"
            className="btn-auth-back"
            onClick={onBackToLanding}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>

          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="auth-form-desc">
              {mode === 'login'
                ? 'Enter your credentials to access your TeamSync workspace.'
                : 'Join over 40,000+ teams managing projects on TeamSync.'}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#B91C1C',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '12px 16px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '8px',
              color: '#047857',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Full Name *</label>
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
              <label className="auth-label">Work Email *</label>
              <input
                type="email"
                className="auth-input"
                placeholder="e.g. rohan.v@teamsync.io"
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
              <label className="auth-label">Password *</label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder={mode === 'register' ? 'Create a secure password (min 4 chars)' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
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

                <a
                  href="#forgot"
                  className="auth-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!email) {
                      setErrorMsg('Please enter your email first to reset your password.');
                    } else {
                      alert(`Password reset instructions have been sent to ${email}`);
                    }
                  }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="btn-auth-submit"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account & Launch Workspace'}</span>
              <ArrowRight size={16} />
            </button>

            {mode === 'login' && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials(DEFAULT_USERS[0])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={13} />
                  <span>Auto-fill demo credentials (rohan.v@teamsync.io / password123)</span>
                </button>
              </div>
            )}

            <div className="auth-divider">
              <span>Or 1-click demo access</span>
            </div>

            <div className="demo-roles-box" style={{ marginTop: '8px' }}>
              <div className="demo-roles-title" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={13} style={{ color: 'var(--primary)' }} />
                <span>Instant Demo Login:</span>
              </div>
              <div className="demo-roles-buttons">
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('rohan')}
                  title="Login as Rohan Verma (Project Manager / Admin)"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                  <span>Admin (Rohan)</span>
                </button>
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('david')}
                  title="Login as David Kim (Lead Developer)"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Code2 size={14} style={{ color: '#3B82F6' }} />
                  <span>Lead Dev (David)</span>
                </button>
                <button
                  type="button"
                  className="btn-demo-role"
                  onClick={() => handleDemoLogin('elena')}
                  title="Login as Elena Rostova (UX Designer)"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Palette size={14} style={{ color: '#8B5CF6' }} />
                  <span>Designer (Elena)</span>
                </button>
              </div>
            </div>

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
                      setSuccessMsg('');
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
                      setSuccessMsg('');
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthView;
