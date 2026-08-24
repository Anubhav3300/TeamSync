import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Zap,
  Trash2,
  Sparkles,
  LogOut,
  Check,
  Save,
  Sliders,
  Mail,
  Shield
} from 'lucide-react';

/**
 * SettingsView Component
 * ----------------------------------------------------
 * High-end enterprise workspace settings & governance with Lucide icons.
 */
function SettingsView({
  currentUser,
  setCurrentUser,
  theme,
  setTheme,
  onLogout,
  onClearAllProjects,
  onLoadSampleData
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [name, setName] = useState(currentUser?.name || 'Rohan Verma');
  const [email, setEmail] = useState(currentUser?.email || 'rohan.v@teamsync.io');
  const [autoNotify, setAutoNotify] = useState(true);
  const [autoReviewer, setAutoReviewer] = useState(true);
  const [slackIntegration, setSlackIntegration] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email
    });
    alert('Settings saved successfully!');
  };

  const rbacRoles = [
    {
      role: 'Admin',
      description: 'Full workspace permissions, billing management, user provisioning, and destructive project actions.',
      color: '#EF4444',
      permissions: ['Manage Users', 'Create/Delete Projects', 'Manage RBAC', 'Export Data', 'Webhook Integrations']
    },
    {
      role: 'Project Manager',
      description: 'Can create and configure projects, assign tasks, manage sprints, and generate analytics reports.',
      color: '#4F46E5',
      permissions: ['Create Projects', 'Assign Tasks', 'Edit Milestones', 'Export Reports']
    },
    {
      role: 'Developer / Contributor',
      description: 'Can transition task status, manage checklist items, post comments, and log time.',
      color: '#10B981',
      permissions: ['Update Task Status', 'Add Comments', 'Manage Checklist', 'View Assigned Projects']
    },
    {
      role: 'UX Designer / QA',
      description: 'Can review deliverables, request revisions, upload design assets, and approve PR acceptance criteria.',
      color: '#F59E0B',
      permissions: ['Review Tasks', 'Approve Deliverables', 'Add Comments']
    }
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Workspace Settings & Governance</h1>
          <p>Configure team permissions, role-based access control (RBAC), and workflow automations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="projects-filter-bar">
        {[
          { id: 'general', label: 'General Profile', icon: User },
          { id: 'rbac', label: 'RBAC & Roles', icon: ShieldCheck },
          { id: 'automations', label: 'Automations', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              <span>User Profile Settings</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Update your personal display name, communication email, and workspace preferences.
            </p>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned System Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentUser?.systemRole || 'Admin'}
                  disabled
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Workspace Data Management (Clear / Restore) */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} style={{ color: 'var(--primary)' }} />
              <span>Workspace Projects & Data Controls</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Manage your workspace data. You can clear all existing projects to start completely from scratch, or load demo sample data anytime.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {onClearAllProjects && (
                <button
                  type="button"
                  onClick={onClearAllProjects}
                  className="btn-secondary"
                  style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={14} />
                  <span>Clear All Projects & Tasks</span>
                </button>
              )}

              {onLoadSampleData && (
                <button
                  type="button"
                  onClick={onLoadSampleData}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  <span>Load Demo Sample Data</span>
                </button>
              )}
            </div>
          </div>

          {onLogout && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '8px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={18} />
                <span>Account & Session</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                End your active session on this device and return to the login screen.
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="btn-secondary"
                style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: RBAC & Permissions */}
      {activeTab === 'rbac' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
              <span>Role-Based Access Control (RBAC) Hierarchy</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Granular permission matrix for enterprise team members.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {rbacRoles.map((r) => (
                <div
                  key={r.role}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{r.role}</h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', minHeight: '40px' }}>
                    {r.description}
                  </p>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    ALLOWED CAPABILITIES:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {r.permissions.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          background: 'var(--bg-surface)',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={11} style={{ color: 'var(--success)' }} />
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Automations */}
      {activeTab === 'automations' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
            <span>Workflow Automation Triggers</span>
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Trigger automatic handoffs and state updates when task stages change.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '10px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Auto-Assign Reviewer on Stage Transition</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  When a task is moved to REVIEW, automatically notify the project manager or QA lead.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoReviewer}
                onChange={() => setAutoReviewer(!autoReviewer)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '10px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Project Completion Progress Recalculation</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Automatically update project % progress and milestone health whenever tasks are marked DONE.
                </div>
              </div>
              <input
                type="checkbox"
                checked={true}
                readOnly
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '10px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Slack & Webhook Dispatch</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Broadcast sprint progress summaries to #engineering-releases every Friday at 4:00 PM.
                </div>
              </div>
              <input
                type="checkbox"
                checked={slackIntegration}
                onChange={() => setSlackIntegration(!slackIntegration)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

    </div>
  );
}

export default SettingsView;
