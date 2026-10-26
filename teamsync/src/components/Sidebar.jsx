import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Check,
  Kanban,
  Bell
} from 'lucide-react';

function Sidebar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onLogout,
  pendingTasksCount,
  unreadNotificationsCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => setActiveTab(item.id)}
      >
        <Icon size={18} className="nav-icon" strokeWidth={isActive ? 2.3 : 1.8} />
        <span>{item.label}</span>
        {item.badge ? (
          <span className={`nav-badge ${item.id === 'notifications' ? 'urgent' : ''}`}>
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Check size={18} strokeWidth={3} />
        </div>
        <div className="brand-info">
          <div className="brand-title">TeamSync</div>
          <span className="brand-version">Enterprise OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(renderNavItem)}
      </nav>

      <div className="sidebar-footer">
        {bottomItems.map(renderNavItem)}

        <div className="sidebar-divider" />

        <div style={{ padding: '0 4px' }}>
          <button
            className="btn-secondary btn-sm"
            style={{
              width: '100%',
              justifyContent: 'center',
              color: 'var(--danger)',
              borderColor: 'var(--border)',
              gap: '8px'
            }}
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
