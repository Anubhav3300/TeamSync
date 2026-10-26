import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, Folder, Maximize2, Plus, CheckSquare } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const formatDateKey = (d) => {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (str) => {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length < 3) return new Date(str);
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
};

export const getRelativeDeadlineLabel = (dueDateStr) => {
  if (!dueDateStr) return '';
  const now = new Date();
  const todayKey = formatDateKey(now);
  if (dueDateStr === todayKey) return 'Due Today';

  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = parseDateKey(dueDateStr);
  if (!targetDate) return dueDateStr;

  const diffTime = targetDate - todayDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Due Tomorrow';
  if (diffDays === -1) return 'Overdue (Yesterday)';
  if (diffDays < -1) return `Overdue (${Math.abs(diffDays)}d ago)`;
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function DeadlineCalendar({
  tasks = [],
  projects = [],
  currentUser = null,
  onTaskClick,
  onNavigateToTasks,
  onOpenCreateTask,
  onOpenFullModal
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [filterScope, setFilterScope] = useState('all');

  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const scopedTasks = useMemo(() => {
    if (filterScope === 'all' || !currentUser) return tasks;
    return tasks.filter((t) => {
      const matchId = t.assigneeId === currentUser.id;
      const matchName =
        t.assigneeName &&
        currentUser.name &&
        t.assigneeName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
      return matchId || matchName;
    });
  }, [tasks, filterScope, currentUser]);

  const scopedProjects = useMemo(() => {
    if (filterScope === 'all' || !currentUser) return projects;
    return projects.filter((p) => {
      const isManager = p.manager === currentUser.name;
      const isMember = Array.isArray(p.members) && p.members.includes(currentUser.id);
      return isManager || isMember;
    });
  }, [projects, filterScope, currentUser]);

  const deadlinesByDate = useMemo(() => {
    const map = {};

    scopedTasks.forEach((task) => {
      if (!task.dueDate) return;
      const key = task.dueDate.slice(0, 10);
      if (!map[key]) map[key] = { tasks: [], projects: [] };
      map[key].tasks.push(task);
    });

    scopedProjects.forEach((project) => {
      if (!project.dueDate) return;
      const key = project.dueDate.slice(0, 10);
      if (!map[key]) map[key] = { tasks: [], projects: [] };
      map[key].projects.push(project);
    });

    return map;
  }, [scopedTasks, scopedProjects]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateObj = new Date(year, month - 1, d);
      const key = formatDateKey(dateObj);
      days.push({
        dayNumber: d,
        dateKey: key,
        dateObj,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(year, month, d);
      const key = formatDateKey(dateObj);
      days.push({
        dayNumber: d,
        dateKey: key,
        dateObj,
        isCurrentMonth: true
      });
    }

    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remainingDays; d++) {
      const dateObj = new Date(year, month + 1, d);
      const key = formatDateKey(dateObj);
      days.push({
        dayNumber: d,
        dateKey: key,
        dateObj,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateKey(formatDateKey(now));
  };

  const selectedDateItems = useMemo(() => {
    if (!selectedDateKey || !deadlinesByDate[selectedDateKey]) {
      return { tasks: [], projects: [] };
    }
    return deadlinesByDate[selectedDateKey];
  }, [selectedDateKey, deadlinesByDate]);

  const upcomingDeadlines = useMemo(() => {
    const all = [];

    scopedTasks.forEach((t) => {
      if (t.dueDate) {
        all.push({
          type: 'task',
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          priority: t.priority,
          status: t.status,
          projectName: t.projectName,
          raw: t
        });
      }
    });

    scopedProjects.forEach((p) => {
      if (p.dueDate) {
        all.push({
          type: 'project',
          id: p.id,
          title: p.name,
          dueDate: p.dueDate,
          priority: p.priority,
          status: p.status,
          projectName: p.category,
          raw: p
        });
      }
    });

    all.sort((a, b) => {
      const da = parseDateKey(a.dueDate);
      const db = parseDateKey(b.dueDate);
      return (da || 0) - (db || 0);
    });

    return all.slice(0, 4);
  }, [scopedTasks, scopedProjects]);

  const totalDeadlinesCount = useMemo(() => {
    let count = 0;
    Object.keys(deadlinesByDate).forEach((k) => {
      count += deadlinesByDate[k].tasks.length + deadlinesByDate[k].projects.length;
    });
    return count;
  }, [deadlinesByDate]);

  return (
    <div className="deadline-calendar-widget">
      <div className="deadline-cal-header">
        <div className="deadline-cal-title-box">
          <span className="deadline-cal-month-name">
            {MONTH_NAMES[month]} {year}
          </span>
          <span className="deadline-cal-badge">
            {totalDeadlinesCount} {totalDeadlinesCount === 1 ? 'Deadline' : 'Deadlines'}
          </span>
        </div>

        <div className="deadline-cal-actions">
          <button
            type="button"
            className="deadline-cal-nav-btn"
            onClick={handleTodayClick}
            title="Jump to Today"
          >
            Today
          </button>
          <button
            type="button"
            className="deadline-cal-icon-btn"
            onClick={handlePrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            className="deadline-cal-icon-btn"
            onClick={handleNextMonth}
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight size={15} />
          </button>
          {onOpenFullModal && (
            <button
              type="button"
              className="deadline-cal-icon-btn"
              onClick={onOpenFullModal}
              title="Expand to Full Schedule Modal"
              aria-label="Expand Calendar"
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="deadline-cal-scope-row">
        <div className="deadline-cal-scope-toggle">
          <button
            type="button"
            className={`deadline-scope-btn ${filterScope === 'all' ? 'active' : ''}`}
            onClick={() => setFilterScope('all')}
          >
            All Team
          </button>
          <button
            type="button"
            className={`deadline-scope-btn ${filterScope === 'mine' ? 'active' : ''}`}
            onClick={() => setFilterScope('mine')}
          >
            My Deadlines
          </button>
        </div>

        {selectedDateKey && (
          <button
            type="button"
            className="deadline-cal-clear-selection"
            onClick={() => setSelectedDateKey(null)}
          >
            Show All
          </button>
        )}
      </div>

      <div className="deadline-cal-weekdays">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="deadline-cal-weekday-cell">
            {wd}
          </div>
        ))}
      </div>

      <div className="deadline-cal-grid">
        {calendarDays.map((day) => {
          const isToday = day.dateKey === todayKey;
          const isSelected = day.dateKey === selectedDateKey;
          const items = deadlinesByDate[day.dateKey];
          const hasTasks = items && items.tasks.length > 0;
          const hasProjects = items && items.projects.length > 0;
          const hasAny = hasTasks || hasProjects;

          const totalCount = (items?.tasks?.length || 0) + (items?.projects?.length || 0);

          const hasHigh = items?.tasks.some((t) => t.priority === 'HIGH');
          const hasMed = items?.tasks.some((t) => t.priority === 'MED');
          const hasLow = items?.tasks.some((t) => t.priority === 'LOW');

          return (
            <button
              key={day.dateKey}
              type="button"
              className={`deadline-cal-day-cell ${
                !day.isCurrentMonth ? 'other-month' : ''
              } ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${
                hasAny ? 'has-deadlines' : ''
              }`}
              onClick={() => {
                if (isSelected) {
                  setSelectedDateKey(null);
                } else {
                  setSelectedDateKey(day.dateKey);
                }
              }}
              title={
                hasAny
                  ? `${totalCount} deadline(s) on ${day.dateKey}`
                  : `${day.dateKey}`
              }
            >
              <span className="deadline-day-number">{day.dayNumber}</span>

              {hasAny && (
                <div className="deadline-day-indicators">
                  {hasHigh && <span className="cal-dot dot-high" />}
                  {hasProjects && <span className="cal-dot dot-project" />}
                  {hasMed && !hasHigh && <span className="cal-dot dot-med" />}
                  {hasLow && !hasHigh && !hasMed && <span className="cal-dot dot-low" />}
                  {totalCount > 2 && (
                    <span className="cal-count-mini">{totalCount}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="deadline-cal-legend">
        <span className="cal-legend-item">
          <span className="cal-dot dot-high" /> High
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot dot-med" /> Med
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot dot-project" /> Project
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot dot-today" /> Today
        </span>
      </div>

      <div className="deadline-schedule-agenda">
        <div className="deadline-agenda-header">
          <div className="deadline-agenda-title">
            <Clock size={13} style={{ color: 'var(--primary)' }} />
            <span>
              {selectedDateKey
                ? `Deadlines on ${parseDateKey(selectedDateKey)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}`
                : 'Upcoming Deadlines'}
            </span>
          </div>
          {selectedDateKey && (
            <button
              type="button"
              className="deadline-agenda-add-btn"
              onClick={() =>
                onOpenCreateTask && onOpenCreateTask('TO DO', selectedDateKey)
              }
              title="Add task for this date"
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          )}
        </div>

        <div className="deadline-agenda-list">
          {selectedDateKey ? (
            selectedDateItems.tasks.length === 0 &&
            selectedDateItems.projects.length === 0 ? (
              <div className="deadline-agenda-empty">
                <span>No deadlines on this day 🎉</span>
                {onOpenCreateTask && (
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', marginTop: '6px' }}
                    onClick={() => onOpenCreateTask('TO DO', selectedDateKey)}
                  >
                    <Plus size={12} />
                    <span>Schedule Task for this Day</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {selectedDateItems.projects.map((proj) => (
                  <div
                    key={`p-${proj.id}`}
                    className="deadline-agenda-item project-item"
                    onClick={() => onNavigateToTasks && onNavigateToTasks(proj.id)}
                  >
                    <div className="deadline-agenda-item-left">
                      <Folder size={14} className="deadline-item-proj-icon" />
                      <div className="deadline-agenda-text">
                        <div className="deadline-agenda-name">{proj.name}</div>
                        <div className="deadline-agenda-sub">{proj.category}</div>
                      </div>
                    </div>
                    <div className="deadline-agenda-item-right">
                      <span className="deadline-agenda-pill pill-proj">Project Due</span>
                    </div>
                  </div>
                ))}

                {selectedDateItems.tasks.map((task) => (
                  <div
                    key={`t-${task.id}`}
                    className="deadline-agenda-item task-item"
                    onClick={() => onTaskClick && onTaskClick(task)}
                  >
                    <div className="deadline-agenda-item-left">
                      <CheckSquare
                        size={14}
                        style={{
                          color:
                            task.status === 'DONE'
                              ? 'var(--success)'
                              : task.priority === 'HIGH'
                              ? 'var(--danger)'
                              : 'var(--primary)'
                        }}
                      />
                      <div className="deadline-agenda-text">
                        <div
                          className={`deadline-agenda-name ${
                            task.status === 'DONE' ? 'strikethrough' : ''
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="deadline-agenda-sub">{task.projectName}</div>
                      </div>
                    </div>
                    <div className="deadline-agenda-item-right">
                      <span
                        className={`deadline-agenda-pill pill-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )
          ) : (
            upcomingDeadlines.length === 0 ? (
              <div className="deadline-agenda-empty">
                <span>No upcoming deadlines scheduled</span>
              </div>
            ) : (
              upcomingDeadlines.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`deadline-agenda-item ${item.type}-item`}
                  onClick={() => {
                    if (item.type === 'task') {
                      onTaskClick && onTaskClick(item.raw);
                    } else {
                      onNavigateToTasks && onNavigateToTasks(item.id);
                    }
                  }}
                >
                  <div className="deadline-agenda-item-left">
                    {item.type === 'task' ? (
                      <CheckSquare
                        size={14}
                        style={{
                          color:
                            item.status === 'DONE'
                              ? 'var(--success)'
                              : item.priority === 'HIGH'
                              ? 'var(--danger)'
                              : 'var(--primary)'
                        }}
                      />
                    ) : (
                      <Folder size={14} className="deadline-item-proj-icon" />
                    )}
                    <div className="deadline-agenda-text">
                      <div
                        className={`deadline-agenda-name ${
                          item.status === 'DONE' ? 'strikethrough' : ''
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="deadline-agenda-sub">{item.projectName}</div>
                    </div>
                  </div>
                  <div className="deadline-agenda-item-right">
                    <span
                      className={`deadline-relative-tag ${
                        getRelativeDeadlineLabel(item.dueDate).includes('Overdue')
                          ? 'urgent'
                          : ''
                      }`}
                    >
                      {getRelativeDeadlineLabel(item.dueDate)}
                    </span>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DeadlineCalendar;
