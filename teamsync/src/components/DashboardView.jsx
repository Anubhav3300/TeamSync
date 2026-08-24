import React, { useState } from 'react';

/**
 * DashboardView Component
 * ----------------------------------------------------
 * - Clean, streamlined UI without bulky clutter
 * - For New Accounts: Clean welcoming onboarding view with 3 actionable steps & sample data option
 * - For Signed-in / Demo Users: Displays personalized "Recent Left Work" (pending tasks assigned to user),
 *   active projects at a glance, quick 1-click status updates, and task completion toggling.
 */
function DashboardView({
  currentUser,
  projects = [],
  tasks = [],
  teamMembers = [],
  onNavigateToProjects,
  onNavigateToTasks,
  onNavigateToTeam,
  onNavigateToCalendar,
  onTaskClick,
  onToggleTaskComplete,
  onUpdateTaskStatus,
  onOpenCreateProject,
  onOpenCreateTask,
  onLoadSampleData,
  onExportReport
}) {
  // Task filter mode: 'my-tasks' (assigned to current user) | 'all-tasks'
  const [taskViewFilter, setTaskViewFilter] = useState('my-tasks');
  const [showCompleted, setShowCompleted] = useState(false);

  const userName = currentUser?.name || 'User';
  const firstName = userName.split(' ')[0];
  const isNewAccount = currentUser?.isNewAccount && projects.length === 0;

  // Filter tasks assigned to current user
  const userAssignedTasks = tasks.filter(t => {
    if (!currentUser) return false;
    const matchId = t.assigneeId === currentUser.id;
    const matchName = t.assigneeName && currentUser.name &&
      t.assigneeName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
    return matchId || matchName;
  });

  // If user has direct tasks, use them. If not (e.g. Lead with no assigned subtasks),
  // fallback gracefully to tasks across projects managed by user or all active tasks.
  const myRelevantTasks = userAssignedTasks.length > 0
    ? userAssignedTasks
    : tasks.filter(t => {
        const isManager = projects.some(p => p.manager === currentUser?.name && p.id === t.projectId);
        return isManager || currentUser?.systemRole === 'Admin';
      });

  // Calculate left work (pending tasks)
  const myPendingTasks = myRelevantTasks.filter(t => t.status !== 'DONE');
  const myCompletedTasks = myRelevantTasks.filter(t => t.status === 'DONE');
  const myInProgressTasks = myRelevantTasks.filter(t => t.status === 'IN PROGRESS');

  const allPendingTasks = tasks.filter(t => t.status !== 'DONE');
  const allCompletedTasks = tasks.filter(t => t.status === 'DONE');

  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  
  // Urgent / Due Soon count
  const urgentTasks = tasks.filter(t => t.status !== 'DONE' && t.priority === 'HIGH');

  // Tasks to display based on active toggle
  const currentTaskList = (taskViewFilter === 'my-tasks' ? myPendingTasks : allPendingTasks);
  const currentCompletedList = (taskViewFilter === 'my-tasks' ? myCompletedTasks : allCompletedTasks);

  // Completion calculation for personal focus ring
  const totalMyTasks = myPendingTasks.length + myCompletedTasks.length;
  const myCompletionRate = totalMyTasks > 0 ? Math.round((myCompletedTasks.length / totalMyTasks) * 100) : 100;

  // --------------------------------------------------------------------------
  // 1. CLEAN ONBOARDING DASHBOARD FOR NEWLY CREATED ACCOUNTS
  // --------------------------------------------------------------------------
  if (isNewAccount) {
    return (
      <div className="page-content">
        {/* Onboarding Hero Banner */}
        <div className="onboarding-hero-card">
          <div className="onboarding-hero-badge">🚀 Workspace Initialized</div>
          <h1 className="onboarding-hero-title">Welcome to TeamSync, {firstName}! 🎉</h1>
          <p className="onboarding-hero-sub">
            Your fresh, uncluttered workspace is ready. You can start from scratch with your own projects,
            or load pre-configured sample data to explore all features instantly.
          </p>

          <div className="onboarding-hero-actions">
            <button className="btn-primary" onClick={onOpenCreateProject}>
              <span>+ Create First Project</span>
            </button>
            <button className="btn-secondary" onClick={onLoadSampleData}>
              <span>✨ Load Demo Sample Data</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Starter Step Cards */}
        <div className="onboarding-steps-grid">
          <div className="onboarding-step-card" onClick={onOpenCreateProject}>
            <div className="onboarding-step-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              📁
            </div>
            <div className="onboarding-step-number">STEP 1</div>
            <h3>Create a Project</h3>
            <p>Set project milestones, sprint categories, priority, and assign project leads.</p>
            <span className="onboarding-step-link">+ New Project →</span>
          </div>

          <div className="onboarding-step-card" onClick={() => onOpenCreateTask('TO DO')}>
            <div className="onboarding-step-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              📋
            </div>
            <div className="onboarding-step-number">STEP 2</div>
            <h3>Add Your Key Tasks</h3>
            <p>Break down goals into actionable items across To Do, In Progress, Review, and Done.</p>
            <span className="onboarding-step-link">+ Add Task →</span>
          </div>

          <div className="onboarding-step-card" onClick={onNavigateToTeam}>
            <div className="onboarding-step-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              👥
            </div>
            <div className="onboarding-step-number">STEP 3</div>
            <h3>Invite Team Members</h3>
            <p>Assign tasks, balance workloads, and track departmental capacity across your team.</p>
            <span className="onboarding-step-link">Manage Team →</span>
          </div>
        </div>

        {/* Minimal Clean Stats Preview */}
        <div className="card" style={{ marginTop: '24px', textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✨</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Zero Clutter, Maximum Productivity
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 16px auto' }}>
            As you create projects and assign tasks, your personalized Left Work queue and Kanban boards will populate here automatically.
          </p>
          <button className="btn-secondary" onClick={onLoadSampleData} style={{ fontSize: '0.88rem' }}>
            Preview with Sample Projects & Tasks
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. STREAMLINED DASHBOARD FOR SIGNED IN & DEMO USERS
  // --------------------------------------------------------------------------
  return (
    <div className="page-content">
      {/* Header Row */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Welcome back, {firstName} <span style={{ fontSize: '1.4rem' }}>👋</span>
          </h1>
          <p>
            {myPendingTasks.length > 0
              ? `You have ${myPendingTasks.length} pending ${myPendingTasks.length === 1 ? 'task' : 'tasks'} waiting for your attention today.`
              : 'All caught up! No pending tasks assigned to you right now.'}
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => onOpenCreateTask('TO DO')}>
            <span>+</span> New Task
          </button>
          <button className="btn-primary" onClick={onOpenCreateProject}>
            <span>+</span> New Project
          </button>
        </div>
      </div>

      {/* 4 Focused Key Metric Tiles */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#EEF2FF', color: 'var(--primary)' }}>
              🎯
            </div>
            <span className="stat-badge positive">Focus</span>
          </div>
          <div>
            <div className="stat-label">Pending for You</div>
            <div className="stat-value">{myPendingTasks.length}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              ⚡
            </div>
            <span className="stat-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>Active</span>
          </div>
          <div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{myInProgressTasks.length}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>
              ⏳
            </div>
            <span className="stat-badge" style={{ background: '#FEF3C7', color: '#D97706' }}>Urgent</span>
          </div>
          <div>
            <div className="stat-label">High Priority</div>
            <div className="stat-value">{urgentTasks.length}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#059669' }}>
              📁
            </div>
            <span className="stat-badge" style={{ background: '#ECFDF5', color: '#059669' }}>Live</span>
          </div>
          <div>
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{activeProjectsCount}</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="dashboard-content-grid">
        {/* Left Column: Recent Left Work Queue */}
        <div className="dashboard-main-col">
          <div className="card">
            <div className="card-header-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📌</span> Recent Left Work
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tasks requiring completion or progress updates
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="dashboard-task-filter-tabs">
                <button
                  className={`dashboard-filter-tab-btn ${taskViewFilter === 'my-tasks' ? 'active' : ''}`}
                  onClick={() => setTaskViewFilter('my-tasks')}
                >
                  Assigned to You ({myPendingTasks.length})
                </button>
                <button
                  className={`dashboard-filter-tab-btn ${taskViewFilter === 'all-tasks' ? 'active' : ''}`}
                  onClick={() => setTaskViewFilter('all-tasks')}
                >
                  All Team ({allPendingTasks.length})
                </button>
              </div>
            </div>

            {/* Task Items List */}
            {currentTaskList.length > 0 ? (
              <div className="recent-tasks-container">
                {currentTaskList.map((task) => {
                  const isHigh = task.priority === 'HIGH';
                  const completedSubtasks = task.subtasks?.filter(st => st.done).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;

                  return (
                    <div
                      key={task.id}
                      className="recent-task-row"
                    >
                      {/* Checkbox circle to complete */}
                      <button
                        className="recent-task-check"
                        title="Mark as complete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTaskComplete(task.id);
                        }}
                      >
                        <span className="check-mark">✓</span>
                      </button>

                      {/* Main Task Meta */}
                      <div
                        className="recent-task-main"
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        <div className="recent-task-title-row">
                          <h4 className="recent-task-title">{task.title}</h4>
                          <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                        </div>

                        <div className="recent-task-meta-row">
                          {/* Project Tag */}
                          <span className="recent-task-project-pill">
                            📁 {task.projectName}
                          </span>

                          {/* Subtasks Count if available */}
                          {totalSubtasks > 0 && (
                            <span className="recent-task-subtasks-pill">
                              ☑ {completedSubtasks}/{totalSubtasks} subtasks
                            </span>
                          )}

                          {/* Due Date */}
                          <span className={`recent-task-due ${isHigh ? 'urgent' : ''}`}>
                            📅 Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>

                          {/* Assignee if in All Team view */}
                          {taskViewFilter === 'all-tasks' && task.assigneeName && (
                            <span className="recent-task-assignee-pill">
                              👤 {task.assigneeName.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="recent-task-actions">
                        <select
                          className="recent-task-status-select"
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="TO DO">TO DO</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="REVIEW">REVIEW</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="recent-tasks-empty">
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                <h4 style={{ fontWeight: 700, color: 'var(--text-main)' }}>You're completely caught up!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  No pending work remaining in this queue.
                </p>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => onOpenCreateTask('TO DO')}
                >
                  + Add a New Task
                </button>
              </div>
            )}

            {/* Collapsible Recently Completed Work */}
            {currentCompletedList.length > 0 && (
              <div className="recent-completed-section">
                <button
                  className="recent-completed-toggle-btn"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <span>✓ Recently Completed ({currentCompletedList.length})</span>
                  <span>{showCompleted ? '▲ Hide' : '▼ Show'}</span>
                </button>

                {showCompleted && (
                  <div className="recent-completed-list">
                    {currentCompletedList.map((task) => (
                      <div
                        key={task.id}
                        className="recent-completed-row"
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        <button
                          className="recent-completed-check checked"
                          title="Reopen task"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskComplete(task.id);
                          }}
                        >
                          ✓
                        </button>
                        <div className="recent-completed-info">
                          <span className="recent-completed-title">{task.title}</span>
                          <span className="recent-completed-proj">📁 {task.projectName}</span>
                        </div>
                        <span className="status-pill status-completed">Done</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Projects & Quick Shortcuts */}
        <div className="dashboard-side-col">
          {/* Active Projects Widget */}
          <div className="card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Active Projects</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Click any project to open Kanban
                </p>
              </div>
              <button
                className="card-action-link"
                onClick={onNavigateToProjects}
              >
                View All →
              </button>
            </div>

            <div className="compact-projects-list">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="compact-project-card"
                  onClick={() => onNavigateToKanban(project.id)}
                >
                  <div className="compact-project-top">
                    <div className="compact-project-icon">{project.icon || '📁'}</div>
                    <div className="compact-project-title-box">
                      <div className="compact-project-name">{project.name}</div>
                      <div className="compact-project-cat">{project.category}</div>
                    </div>
                    <span className="compact-project-arrow">→</span>
                  </div>

                  <div className="compact-project-progress-wrap">
                    <div className="progress-track" style={{ height: '6px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${project.progress}%`,
                          background:
                            project.progress > 80 ? 'var(--success)' :
                            project.progress < 40 ? 'var(--warning)' : 'var(--primary)'
                        }}
                      />
                    </div>
                    <div className="compact-project-progress-meta">
                      <span>{project.progress}% complete</span>
                      <span>Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Focus & Shortcuts Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title">Personal Progress</h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                {myCompletionRate}% Done
              </span>
            </div>

            <div className="progress-track" style={{ height: '8px', marginBottom: '14px' }}>
              <div
                className="progress-fill"
                style={{ width: `${myCompletionRate}%`, background: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.88rem' }}
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
              >
                <span>📝</span> Open Task Manager
              </button>
              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.88rem' }}
                onClick={onNavigateToCalendar}
              >
                <span>📅</span> View Scheduled Deadlines
              </button>
              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.88rem' }}
                onClick={onExportReport}
              >
                <span>📊</span> Generate Productivity Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
