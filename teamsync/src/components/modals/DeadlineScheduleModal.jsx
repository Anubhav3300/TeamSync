import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Folder,
  Search,
  Filter,
  CheckSquare,
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  formatDateKey,
  parseDateKey,
  getRelativeDeadlineLabel
} from '../DeadlineCalendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function DeadlineScheduleModal({
  isOpen,
  onClose,
  tasks = [],
  projects = [],
  currentUser = null,
  onTaskClick,
  onNavigateToTasks,
  onOpenCreateTask,
  onToggleTaskComplete
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'ALL' | 'PENDING' | 'DONE'

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Combine tasks & projects into a unified deadlines list
  const allDeadlines = useMemo(() => {
    const list = [];

    tasks.forEach((t) => {
      if (t.dueDate) {
        list.push({
          id: t.id,
          type: 'task',
          title: t.title,
          description: t.description,
          dueDate: t.dueDate.slice(0, 10),
          priority: t.priority || 'MED',
          status: t.status || 'TO DO',
          projectName: t.projectName || 'Project',
          projectId: t.projectId,
          assigneeName: t.assigneeName,
          assigneeAvatar: t.assigneeAvatar,
          raw: t
        });
      }
    });

    projects.forEach((p) => {
      if (p.dueDate) {
        list.push({
          id: p.id,
          type: 'project',
          title: p.name,
          description: p.description,
          dueDate: p.dueDate.slice(0, 10),
          priority: p.priority || 'High',
          status: p.status || 'Active',
          projectName: p.category || 'Initiative',
          projectId: p.id,
          progress: p.progress,
          raw: p
        });
      }
    });

    return list;
  }, [tasks, projects]);

  // Deadlines mapped by date string
  const deadlinesByDate = useMemo(() => {
    const map = {};
    allDeadlines.forEach((item) => {
      if (!map[item.dueDate]) map[item.dueDate] = [];
      map[item.dueDate].push(item);
    });
    return map;
  }, [allDeadlines]);

  // Calendar days generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateObj = new Date(year, month - 1, d);
      days.push({
        dayNumber: d,
        dateKey: formatDateKey(dateObj),
        dateObj,
        isCurrentMonth: false
      });
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(year, month, d);
      days.push({
        dayNumber: d,
        dateKey: formatDateKey(dateObj),
        dateObj,
        isCurrentMonth: true
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const dateObj = new Date(year, month + 1, d);
      days.push({
        dayNumber: d,
        dateKey: formatDateKey(dateObj),
        dateObj,
        isCurrentMonth: false
      });
    }

    return days;
  }, [year, month]);

  // Filtered list for the agenda column
  const filteredAgendaList = useMemo(() => {
    return allDeadlines.filter((item) => {
      // Date filter
      if (selectedDateKey && item.dueDate !== selectedDateKey) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL') {
        if (item.priority.toUpperCase() !== priorityFilter) return false;
      }

      // Status filter
      if (statusFilter === 'PENDING' && item.status === 'DONE') return false;
      if (statusFilter === 'DONE' && item.status !== 'DONE') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchProj = item.projectName.toLowerCase().includes(q);
        const matchAssignee = item.assigneeName && item.assigneeName.toLowerCase().includes(q);
        if (!matchTitle && !matchProj && !matchAssignee) return false;
      }

      return true;
    }).sort((a, b) => {
      const da = parseDateKey(a.dueDate);
      const db = parseDateKey(b.dueDate);
      return (da || 0) - (db || 0);
    });
  }, [allDeadlines, selectedDateKey, priorityFilter, statusFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card deadline-schedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="deadline-modal-header-icon">
              <CalendarIcon size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                Deadline Schedule & Calendar
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Track delivery milestones, project deadlines, and sprint deliverables
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Split Calendar + Agenda */}
        <div className="deadline-modal-body">
          {/* Left Column: Full Month Calendar */}
          <div className="deadline-modal-calendar-pane">
            <div className="deadline-modal-cal-nav">
              <h3 className="deadline-modal-cal-month">
                {MONTH_NAMES[month]} {year}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    const now = new Date();
                    setCurrentDate(now);
                    setSelectedDateKey(formatDateKey(now));
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="deadline-cal-icon-btn"
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  aria-label="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="deadline-cal-icon-btn"
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  aria-label="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="deadline-modal-weekdays-row">
              {SHORT_WEEKDAYS.map((wd) => (
                <div key={wd} className="deadline-modal-weekday-name">
                  {wd}
                </div>
              ))}
            </div>

            <div className="deadline-modal-days-grid">
              {calendarDays.map((day) => {
                const isToday = day.dateKey === todayKey;
                const isSelected = day.dateKey === selectedDateKey;
                const itemsOnDay = deadlinesByDate[day.dateKey] || [];
                const count = itemsOnDay.length;

                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    className={`deadline-modal-day-card ${
                      !day.isCurrentMonth ? 'other-month' : ''
                    } ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDateKey(null);
                      } else {
                        setSelectedDateKey(day.dateKey);
                      }
                    }}
                  >
                    <div className="deadline-modal-day-top">
                      <span className="deadline-modal-day-num">{day.dayNumber}</span>
                      {count > 0 && (
                        <span className="deadline-modal-day-badge">{count}</span>
                      )}
                    </div>

                    <div className="deadline-modal-day-pills">
                      {itemsOnDay.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`deadline-modal-day-mini-pill ${
                            item.type === 'project' ? 'proj' : item.priority.toLowerCase()
                          }`}
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      ))}
                      {count > 2 && (
                        <span className="deadline-modal-more-count">
                          +{count - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="deadline-modal-legend">
              <span className="cal-legend-item">
                <span className="cal-dot dot-high" /> High Priority
              </span>
              <span className="cal-legend-item">
                <span className="cal-dot dot-med" /> Medium Priority
              </span>
              <span className="cal-legend-item">
                <span className="cal-dot dot-project" /> Project Due
              </span>
              <span className="cal-legend-item">
                <span className="cal-dot dot-today" /> Today
              </span>
            </div>
          </div>

          {/* Right Column: Deadlines Agenda & Filtering */}
          <div className="deadline-modal-agenda-pane">
            {/* Filter and Search Bar */}
            <div className="deadline-modal-search-box">
              <Search size={15} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search deadlines by title or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="deadline-modal-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="deadline-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="deadline-modal-filters-row">
              <div className="deadline-filter-group">
                <span className="deadline-filter-label">Priority:</span>
                <div className="deadline-filter-chips">
                  {['ALL', 'HIGH', 'MED', 'LOW'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`deadline-chip ${priorityFilter === p ? 'active' : ''}`}
                      onClick={() => setPriorityFilter(p)}
                    >
                      {p === 'ALL' ? 'All' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="deadline-filter-group">
                <span className="deadline-filter-label">Status:</span>
                <div className="deadline-filter-chips">
                  {['PENDING', 'ALL', 'DONE'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`deadline-chip ${statusFilter === s ? 'active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s === 'PENDING' ? 'Pending' : s === 'ALL' ? 'All' : 'Done'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Date Indicator Banner */}
            {selectedDateKey && (
              <div className="deadline-selected-date-banner">
                <span>
                  Showing deadlines on{' '}
                  <strong>
                    {parseDateKey(selectedDateKey)?.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </strong>
                </span>
                <button
                  type="button"
                  className="deadline-clear-btn"
                  onClick={() => setSelectedDateKey(null)}
                >
                  Show All Dates
                </button>
              </div>
            )}

            {/* Agenda Items List */}
            <div className="deadline-modal-agenda-items">
              {filteredAgendaList.length === 0 ? (
                <div className="deadline-modal-empty-state">
                  <Clock size={36} style={{ color: 'var(--text-subtle)', marginBottom: '8px' }} />
                  <h4>No deadlines found</h4>
                  <p>
                    {selectedDateKey
                      ? 'No tasks or projects are due on this selected date.'
                      : 'Try adjusting your search query or priority filters.'}
                  </p>
                  {onOpenCreateTask && (
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      style={{ marginTop: '12px' }}
                      onClick={() => {
                        onClose();
                        onOpenCreateTask('TO DO', selectedDateKey);
                      }}
                    >
                      <Plus size={14} />
                      <span>Add Task for this Date</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredAgendaList.map((item) => {
                  const isDone = item.status === 'DONE';
                  const relLabel = getRelativeDeadlineLabel(item.dueDate);
                  const isUrgent = relLabel.includes('Overdue') || relLabel === 'Due Today';

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`deadline-modal-item-row ${
                        item.type === 'project' ? 'is-project' : ''
                      } ${isDone ? 'is-completed' : ''}`}
                    >
                      <div className="deadline-modal-item-left">
                        {item.type === 'task' ? (
                          <button
                            type="button"
                            className={`deadline-checkbox ${isDone ? 'checked' : ''}`}
                            onClick={() =>
                              onToggleTaskComplete && onToggleTaskComplete(item.id)
                            }
                            title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {isDone && <CheckSquare size={14} />}
                          </button>
                        ) : (
                          <div className="deadline-proj-icon-box">
                            <Folder size={15} style={{ color: 'var(--primary)' }} />
                          </div>
                        )}

                        <div
                          className="deadline-modal-item-details"
                          onClick={() => {
                            onClose();
                            if (item.type === 'task') {
                              onTaskClick && onTaskClick(item.raw);
                            } else {
                              onNavigateToTasks && onNavigateToTasks(item.id);
                            }
                          }}
                        >
                          <div className="deadline-modal-item-title-row">
                            <span
                              className={`deadline-modal-item-title ${
                                isDone ? 'strikethrough' : ''
                              }`}
                            >
                              {item.title}
                            </span>
                            <span
                              className={`priority-tag priority-${item.priority.toLowerCase()}`}
                            >
                              {item.priority}
                            </span>
                          </div>

                          <div className="deadline-modal-item-meta">
                            <span className="deadline-modal-proj-name">
                              <Folder size={12} />
                              <span>{item.projectName}</span>
                            </span>

                            {item.assigneeName && (
                              <span className="deadline-modal-assignee">
                                Assigned: {item.assigneeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="deadline-modal-item-right">
                        <span
                          className={`deadline-relative-tag ${isUrgent ? 'urgent' : ''}`}
                        >
                          {relLabel}
                        </span>
                        <button
                          type="button"
                          className="deadline-view-details-btn"
                          title="View Details"
                          onClick={() => {
                            onClose();
                            if (item.type === 'task') {
                              onTaskClick && onTaskClick(item.raw);
                            } else {
                              onNavigateToTasks && onNavigateToTasks(item.id);
                            }
                          }}
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filteredAgendaList.length} scheduled deliverable(s)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
            {onOpenCreateTask && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onOpenCreateTask('TO DO', selectedDateKey);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} />
                <span>Create New Task</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeadlineScheduleModal;
