import React from 'react';
import { Target, Zap, Clock, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';

function ReportsView({ projects = [], tasks = [], teamMembers = [] }) {
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS').length;
  const inReviewTasks = tasks.filter(t => t.status === 'REVIEW').length;
  const todoTasks = tasks.filter(t => t.status === 'TO DO').length;
  const totalTasks = tasks.length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const sprintVelocity = [
    { sprint: 'Sprint 20', committed: 38, completed: 35 },
    { sprint: 'Sprint 21', committed: 42, completed: 40 },
    { sprint: 'Sprint 22', committed: 45, completed: 44 },
    { sprint: 'Sprint 23', committed: 50, completed: 48 },
    { sprint: 'Sprint 24', committed: 52, completed: 46 }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Productivity & Velocity Reports</h1>
          <p>Analyze team throughput, sprint velocity, and resource health metrics.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <Target size={20} strokeWidth={2.2} />
            </div>
            <span className="stat-badge positive">Target</span>
          </div>
          <div>
            <div className="stat-label">Completion Rate</div>
            <div className="stat-value">{completionRate}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              <Zap size={20} strokeWidth={2.2} />
            </div>
            <span className="stat-badge positive" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={12} /> +4.2 pts
            </span>
          </div>
          <div>
            <div className="stat-label">Avg Sprint Points</div>
            <div className="stat-value">46.5 pts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#EEF2FF', color: '#6366F1' }}>
              <Clock size={20} strokeWidth={2.2} />
            </div>
            <span className="stat-badge positive">2.4 Days</span>
          </div>
          <div>
            <div className="stat-label">Cycle Time</div>
            <div className="stat-value">Fast</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <AlertTriangle size={20} strokeWidth={2.2} />
            </div>
            <span className="stat-badge negative">Urgent</span>
          </div>
          <div>
            <div className="stat-label">Tasks in Review</div>
            <div className="stat-value">{inReviewTasks}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <span>Sprint Velocity (Story Points)</span>
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '20px 10px 10px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
            {sprintVelocity.map((sv, idx) => {
              const heightPct = (sv.completed / 60) * 100;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{sv.completed} pts</span>
                  <div style={{
                    width: '36px',
                    height: `${heightPct}%`,
                    background: idx === sprintVelocity.length - 1 ? 'var(--primary)' : 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {sv.sprint.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} style={{ color: 'var(--primary)' }} />
            <span>Project Health & Milestones</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No active projects to report on.
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {p.dueDate}</div>
                  </div>

                  <div className="progress-track" style={{ flex: 1, height: '8px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${p.progress}%`,
                        background: p.progress > 80 ? 'var(--success)' : p.progress < 50 ? 'var(--warning)' : 'var(--primary)'
                      }}
                    />
                  </div>

                  <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '35px', textAlign: 'right' }}>
                    {p.progress}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;
