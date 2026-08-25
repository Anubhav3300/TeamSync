import React, { useState } from 'react';
import {
  Target,
  Zap,
  Clock,
  FolderKanban,
  Check,
  CheckCircle2,
  Calendar,
  ListTodo,
  Plus,
  Trash2,
  FolderPlus,
  UserPlus,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Folder,
  BarChart2,
  CheckSquare
} from 'lucide-react';

function DashboardView({
  currentUser,
  projects = [],
  tasks = [],
  teamMembers = [],
  onNavigateToProjects,
  onNavigateToTasks,
  onNavigateToTeam,
  onTaskClick,
  onToggleTaskComplete,
  onUpdateTaskStatus,
  onOpenCreateProject,
  onOpenCreateTask,
  onClearAllProjects,
  onLoadSampleData,
  onExportReport
}) {
  const [taskViewFilter, setTaskViewFilter] = useState('my-tasks');
  const [showCompleted, setShowCompleted] = useState(false);

  const userName = currentUser?.name || 'User';
  const firstName = userName.split(' ')[0];
  const isCleanWorkspace = projects.length === 0;

  const userAssignedTasks = tasks.filter(t => {
    if (!currentUser) return false;
    const matchId = t.assigneeId === currentUser.id;
    const matchName = t.assigneeName && currentUser.name &&
      t.assigneeName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
    return matchId || matchName;
  });

  const myRelevantTasks = userAssignedTasks.length > 0
    ? userAssignedTasks
    : tasks.filter(t => {
      const isManager = projects.some(p => p.manager === currentUser?.name && p.id === t.projectId);
      return isManager || currentUser?.systemRole === 'Admin';
    });

  const myPendingTasks = myRelevantTasks.filter(t => t.status !== 'DONE');
  const myCompletedTasks = myRelevantTasks.filter(t => t.status === 'DONE');
  const myInProgressTasks = myRelevantTasks.filter(t => t.status === 'IN PROGRESS');

  const allPendingTasks = tasks.filter(t => t.status !== 'DONE');
  const allCompletedTasks = tasks.filter(t => t.status === 'DONE');

  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const urgentTasks = tasks.filter(t => t.status !== 'DONE' && t.priority === 'HIGH');

  const currentTaskList = (taskViewFilter === 'my-tasks' ? myPendingTasks : allPendingTasks);
  const currentCompletedList = (taskViewFilter === 'my-tasks' ? myCompletedTasks : allCompletedTasks);

  const totalMyTasks = myPendingTasks.length + myCompletedTasks.length;
  const myCompletionRate = totalMyTasks > 0 ? Math.round((myCompletedTasks.length / totalMyTasks) * 100) : 100;

  if (isCleanWorkspace) {
    return (
      <div className="page-content">
        <div className="onboarding-hero-card">
          <div className="onboarding-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} />
            <span>Workspace Initialized</span>
          </div>
          <h1 className="onboarding-hero-title">Welcome to TeamSync, {firstName}!</h1>
          <p className="onboarding-hero-sub">
            Your fresh, uncluttered workspace is ready. You can start from scratch with your own projects,
            or load pre-configured sample data to explore all features instantly.
          </p>

          <div className="onboarding-hero-actions">
            <button className="btn-primary" onClick={onOpenCreateProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>Create First Project</span>
            </button>
            <button className="btn-secondary" onClick={onLoadSampleData} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} style={{ color: 'var(--primary)' }} />
              <span>Load Demo Sample Data</span>
            </button>
          </div>
        </div>

        <div className="onboarding-steps-grid">
          <div className="onboarding-step-card" onClick={onOpenCreateProject}>
            <div className="onboarding-step-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <FolderPlus size={24} />
            </div>
            <div className="onboarding-step-number">STEP 1</div>
            <h3>Create a Project</h3>
            <p>Set project milestones, sprint categories, priority, and assign project leads.</p>
            <span className="onboarding-step-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>New Project</span>
              <ArrowRight size={13} />
            </span>
          </div>

          <div className="onboarding-step-card" onClick={() => onOpenCreateTask('TO DO')}>
            <div className="onboarding-step-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <ListTodo size={24} />
            </div>
            <div className="onboarding-step-number">STEP 2</div>
            <h3>Add Your Key Tasks</h3>
            <p>Break down goals into actionable items across To Do, In Progress, Review, and Done.</p>
            <span className="onboarding-step-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Add Task</span>
              <ArrowRight size={13} />
            </span>
          </div>

          <div className="onboarding-step-card" onClick={onNavigateToTeam}>
            <div className="onboarding-step-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <UserPlus size={24} />
            </div>
            <div className="onboarding-step-number">STEP 3</div>
            <h3>Invite Team Members</h3>
            <p>Assign tasks, balance workloads, and track departmental capacity across your team.</p>
            <span className="onboarding-step-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Manage Team</span>
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px', textAlign: 'center', padding: '36px 24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px' }}>
            <Sparkles size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Zero Clutter, Maximum Productivity
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 18px auto' }}>
            As you create projects and assign tasks, your personalized Left Work queue and Kanban boards will populate here automatically.
          </p>
          <button className="btn-secondary" onClick={onLoadSampleData} style={{ fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
            <Sparkles size={14} />
            <span>Preview with Sample Projects & Tasks</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Welcome back, {firstName}
          </h1>
          <p>
            {myPendingTasks.length > 0
              ? `You have ${myPendingTasks.length} pending ${myPendingTasks.length === 1 ? 'task' : 'tasks'} waiting for your attention today.`
              : 'All caught up! No pending tasks assigned to you right now.'}
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => onOpenCreateTask('TO DO')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} />
            <span>New Task</span>
          </button>
          <button className="btn-primary" onClick={onOpenCreateProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ background: '#EEF2FF', color: 'var(--primary)' }}>
              <Target size={20} strokeWidth={2.2} />
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
              <Zap size={20} strokeWidth={2.2} />
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
              <Clock size={20} strokeWidth={2.2} />
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
              <FolderKanban size={20} strokeWidth={2.2} />
            </div>
            <span className="stat-badge" style={{ background: '#ECFDF5', color: '#059669' }}>Live</span>
          </div>
          <div>
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{activeProjectsCount}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-main-col">
          <div className="card">
            <div className="card-header-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ListTodo size={18} style={{ color: 'var(--primary)' }} />
                  <span>Recent Left Work</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tasks requiring completion or progress updates
                </p>
              </div>

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
                      <button
                        className="recent-task-check"
                        title="Mark as complete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTaskComplete(task.id);
                        }}
                      >
                        <span className="check-mark">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      </button>

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
                          <span className="recent-task-project-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Folder size={12} />
                            <span>{task.projectName}</span>
                          </span>

                          {totalSubtasks > 0 && (
                            <span className="recent-task-subtasks-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckSquare size={12} />
                              <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                            </span>
                          )}

                          <span className={`recent-task-due ${isHigh ? 'urgent' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </span>

                          {taskViewFilter === 'all-tasks' && task.assigneeName && (
                            <span className="recent-task-assignee-pill">
                              {task.assigneeName.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>

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
                <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontWeight: 700, color: 'var(--text-main)' }}>You're completely caught up!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  No pending work remaining in this queue.
                </p>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => onOpenCreateTask('TO DO')}
                >
                  <Plus size={14} />
                  <span>Add a New Task</span>
                </button>
              </div>
            )}

            {currentCompletedList.length > 0 && (
              <div className="recent-completed-section">
                <button
                  className="recent-completed-toggle-btn"
                  onClick={() => setShowCompleted(!showCompleted)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--success)' }} />
                    <span>Recently Completed ({currentCompletedList.length})</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                    {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span>{showCompleted ? 'Hide' : 'Show'}</span>
                  </span>
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
                          <Check size={11} strokeWidth={3} />
                        </button>
                        <div className="recent-completed-info">
                          <span className="recent-completed-title">{task.title}</span>
                          <span className="recent-completed-proj" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Folder size={11} />
                            <span>{task.projectName}</span>
                          </span>
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

        <div className="dashboard-side-col">
          <div className="card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Active Projects</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Ongoing initiatives & progress
                </p>
              </div>
              <button
                className="card-action-link"
                onClick={onNavigateToProjects}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="compact-projects-list">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="compact-project-card"
                  onClick={() => onNavigateToTasks && onNavigateToTasks(project.id)}
                >
                  <div className="compact-project-top">
                    <div className="compact-project-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Folder size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="compact-project-title-box">
                      <div className="compact-project-name">{project.name}</div>
                      <div className="compact-project-cat">{project.category}</div>
                    </div>
                    <ArrowRight size={14} className="compact-project-arrow" />
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
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
              >
                <ListTodo size={16} style={{ color: 'var(--primary)' }} />
                <span>Open Task Manager</span>
              </button>
              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={onExportReport}
              >
                <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
                <span>Generate Productivity Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
