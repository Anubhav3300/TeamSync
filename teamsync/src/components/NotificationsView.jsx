import React, { useState, useMemo } from 'react';
import { Bell, CheckCheck, Trash2, Search, CheckSquare, Clock, TrendingUp, MessageSquare, RotateCcw, CheckCircle2, Inbox } from 'lucide-react';

function NotificationsView({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAllNotifications,
  onResetNotifications,
  onNotificationClick,
  showToast
}) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'ASSIGNMENT' | 'CALENDAR' | 'MILESTONE'
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = notif.title?.toLowerCase().includes(q);
        const matchMsg = notif.message?.toLowerCase().includes(q);
        if (!matchTitle && !matchMsg) return false;
      }

      // Filter
      if (activeFilter === 'UNREAD') {
        return !notif.read;
      }
      if (activeFilter === 'ASSIGNMENT') {
        return notif.type === 'assignment';
      }
      if (activeFilter === 'CALENDAR') {
        return notif.type === 'calendar';
      }
      if (activeFilter === 'MILESTONE') {
        return notif.type === 'milestone';
      }

      return true;
    });
  }, [notifications, searchQuery, activeFilter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <CheckSquare size={16} className="notif-type-icon assignment" />;
      case 'calendar':
        return <Clock size={16} className="notif-type-icon calendar" />;
      case 'milestone':
        return <TrendingUp size={16} className="notif-type-icon milestone" />;
      case 'comment':
        return <MessageSquare size={16} className="notif-type-icon comment" />;
      default:
        return <Bell size={16} className="notif-type-icon default" />;
    }
  };

  return (
    <div className="page-content notifications-page-content">
      {/* Header */}
      <div className="page-header notifications-page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="notifications-header-icon-box">
              <Bell size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1>Notifications</h1>
                {unreadCount > 0 && (
                  <span className="notifications-unread-badge">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p>Stay updated with task assignments, deadlines, comments, and project milestones.</p>
            </div>
          </div>
        </div>

        <div className="page-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                if (onMarkAllAsRead) onMarkAllAsRead();
                if (showToast) showToast('✓ All notifications marked as read');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCheck size={14} />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              if (onResetNotifications) onResetNotifications();
              if (showToast) showToast('✓ Restored default static notifications');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Reload static demo notifications"
          >
            <RotateCcw size={14} />
            <span>Reset Static Data</span>
          </button>

          {notifications.length > 0 && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm('Clear all notifications?')) {
                  if (onClearAllNotifications) onClearAllNotifications();
                  if (showToast) showToast('All notifications cleared');
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-subtle)' }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="notifications-controls-bar">
        <div className="notifications-filter-pills">
          <button
            type="button"
            className={`notif-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All <span className="pill-count">{notifications.length}</span>
          </button>
          <button
            type="button"
            className={`notif-filter-btn ${activeFilter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setActiveFilter('UNREAD')}
          >
            Unread <span className="pill-count">{unreadCount}</span>
          </button>
          <button
            type="button"
            className={`notif-filter-btn ${activeFilter === 'ASSIGNMENT' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ASSIGNMENT')}
          >
            Tasks
          </button>
          <button
            type="button"
            className={`notif-filter-btn ${activeFilter === 'CALENDAR' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CALENDAR')}
          >
            Deadlines
          </button>
          <button
            type="button"
            className={`notif-filter-btn ${activeFilter === 'MILESTONE' ? 'active' : ''}`}
            onClick={() => setActiveFilter('MILESTONE')}
          >
            Milestones
          </button>
        </div>

        <div className="notifications-search-wrap">
          <Search size={14} style={{ color: 'var(--text-subtle)' }} />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search in notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container card">
        {filteredNotifications.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.read ? 'unread' : 'read'}`}
                  onClick={() => {
                    if (onNotificationClick) {
                      onNotificationClick(notif);
                    } else if (onMarkAsRead) {
                      onMarkAsRead(notif.id);
                    }
                  }}
                >
                  {/* Category Icon */}
                  <div className="notification-icon-wrap">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Notification Content */}
                  <div className="notification-body">
                    <div className="notification-header-row">
                      <div className="notification-title-wrap">
                        <span className="notification-title">{notif.title}</span>
                        {notif.project && (
                          <span className="notif-project-tag">{notif.project}</span>
                        )}
                        {!notif.read && <span className="unread-dot" title="Unread notification" />}
                      </div>
                      <span className="notification-time">{notif.time}</span>
                    </div>

                    <p className="notification-message">{notif.message}</p>
                  </div>

                  {/* Actions on Item */}
                  <div className="notification-actions-wrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="notif-action-btn"
                      onClick={() => onMarkAsRead && onMarkAsRead(notif.id)}
                      title={notif.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <CheckCircle2 size={14} style={{ color: notif.read ? 'var(--text-subtle)' : 'var(--primary)' }} />
                    </button>

                    <button
                      type="button"
                      className="notif-action-btn delete"
                      onClick={() => onDeleteNotification && onDeleteNotification(notif.id)}
                      title="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="notifications-empty-state">
            <div className="empty-icon-box">
              <Inbox size={32} style={{ color: 'var(--text-subtle)' }} />
            </div>
            <h3 className="empty-title">All Caught Up!</h3>
            <p className="empty-desc">
              {activeFilter !== 'ALL' || searchQuery
                ? 'No notifications match your current filter criteria.'
                : 'You have no notifications right now.'}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
              {(activeFilter !== 'ALL' || searchQuery) && (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setActiveFilter('ALL');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => {
                  if (onResetNotifications) onResetNotifications();
                  setActiveFilter('ALL');
                  setSearchQuery('');
                  if (showToast) showToast('✓ Restored default static notifications');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} />
                <span>Restore Static Notifications</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsView;
