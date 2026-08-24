import React, { useState } from 'react';
import { Search, X, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';

/**
 * TopNav Component
 * ----------------------------------------------------
 * High-end enterprise Top Navigation Bar with Lucide React Icons.
 */
function TopNav({
  searchQuery,
  setSearchQuery,
  currentUser,
  setCurrentUser,
  onLogout
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="top-nav">
      {/* Global Search Bar */}
      <div className="nav-search-container">
        <Search size={16} className="text-muted" style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
        <input
          type="text"
          className="nav-search-input"
          placeholder="Search tasks, projects, or people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            style={{
              color: 'var(--text-subtle)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="top-nav-right">
        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="user-profile-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
            }}
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="user-avatar-img"
            />
            <div className="user-info-text">
              <span className="user-info-name">{currentUser?.name || 'Workspace User'}</span>
              <span className="user-info-role">{currentUser?.role || 'Member'}</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '240px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                padding: '16px',
                zIndex: 50
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                  <span className="priority-tag priority-high" style={{ fontSize: '0.7rem' }}>
                    Role: {currentUser?.role || currentUser?.systemRole || 'Member'}
                  </span>
                </div>
              </div>

              {onLogout && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      color: '#EF4444',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
