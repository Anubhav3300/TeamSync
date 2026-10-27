import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPendingTasksCount } from '../store/tasksSlice';
import { selectUnreadNotificationsCount } from '../store/notificationsSlice';
import { useAuth } from '../context/AuthContext';
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

function Sidebar({ onLogout: customLogout }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const pendingTasksCount = useSelector(selectPendingTasksCount);
  const unreadNotificationsCount = useSelector(selectUnreadNotificationsCount);

  const navItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', path: '/projects', label: 'My Projects', icon: FolderKanban },
    { id: 'kanban', path: '/kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'tasks', path: '/tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    {
      id: 'notifications',
      path: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: 'team', path: '/team', label: 'Team', icon: Users },
    { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart3 }
  ];

  const bottomItems = [
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings }
  ];

  const handleSignOut = () => {
    if (customLogout) {
      customLogout();
    } else {
      logout();
      navigate('/');
    }
  };

  const renderNavLink = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        style={{ textDecoration: 'none' }}
      >
        {({ isActive }) => (
          <>
            <Icon size={18} className="nav-icon" strokeWidth={isActive ? 2.3 : 1.8} />
            <span>{item.label}</span>
            {item.badge ? (
              <span className={`nav-badge ${item.id === 'notifications' ? 'urgent' : ''}`}>
                {item.badge}
              </span>
            ) : null}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon-box">
            <Check size={18} strokeWidth={3} />
          </div>
          <div className="brand-info">
            <div className="brand-title">TeamSync</div>
            <span className="brand-version">Enterprise OS</span>
          </div>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(renderNavLink)}
      </nav>

      <div className="sidebar-footer">
        {bottomItems.map(renderNavLink)}

        <div className="sidebar-divider" />

        <div style={{ padding: '0 4px' }}>
          <button
            className="btn-secondary btn-sm"
            style={{
              width: '100%',
              justifyContent: 'center',
              color: 'var(--danger)',
              borderColor: 'var(--border)',
              gap: '8px',
              cursor: 'pointer'
            }}
            onClick={handleSignOut}
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
