import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Folder, Clock, CheckCircle2 } from 'lucide-react';

/**
 * CalendarView Component
 * ----------------------------------------------------
 * High-end enterprise sprint calendar with Lucide icons.
 */
function CalendarView({ tasks = [], onTaskClick }) {
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed, 9 = October
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(12);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const getTasksForDay = (day) => {
    if (!day) return [];
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const selectedDayTasks = getTasksForDay(selectedDay);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Calendar & Deliverable Deadlines</h1>
          <p>Schedule, visualize deadlines, and manage sprint milestones.</p>
        </div>

        <div className="page-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px' }}>
            <button className="btn-sm" onClick={prevMonth} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '140px', textAlign: 'center', color: 'var(--text-main)' }}>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button className="btn-sm" onClick={nextMonth} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Calendar Grid */}
        <div className="card" style={{ padding: '20px' }}>
          {/* Day Names */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
            marginBottom: '12px',
            textTransform: 'uppercase'
          }}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ minHeight: '80px', opacity: 0.2 }} />;
              }

              const dayTasks = getTasksForDay(day);
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: '84px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)'
                    }}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '1px 5px',
                        borderRadius: '10px'
                      }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          background: t.priority === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                          color: t.priority === 'HIGH' ? '#DC2626' : '#D97706',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 600
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Schedule Side Panel */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '4px' }}>
            Schedule for {monthNames[currentMonth]} {selectedDay}, {currentYear}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {selectedDayTasks.length} task(s) scheduled on this day
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--bg-subtle)', marginBottom: '10px' }}>
                  <CalendarIcon size={26} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>No task deadlines scheduled for this day.</div>
              </div>
            ) : (
              selectedDayTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onTaskClick && onTaskClick(t)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className={`priority-tag ${t.priority === 'HIGH' ? 'priority-high' : 'priority-med'}`}>
                      {t.priority}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <User size={11} /> {t.assigneeName}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Folder size={11} /> {t.projectName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
