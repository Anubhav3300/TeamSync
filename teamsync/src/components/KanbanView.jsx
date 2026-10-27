import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import { Search, Plus, RotateCcw, CheckSquare, User, Calendar, Folder, LayoutGrid, Table as TableIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS = [
  { id: 'TO DO', title: 'To Do', subtitle: 'Backlog & planned work', color: '#6366F1' },
  { id: 'IN PROGRESS', title: 'In Progress', subtitle: 'Actively being developed', color: '#F59E0B' },
  { id: 'REVIEW', title: 'Under Review', subtitle: 'Peer review & QA testing', color: '#8B5CF6' },
  { id: 'DONE', title: 'Completed', subtitle: 'Verified & closed deliverables', color: '#10B981' }
];

function KanbanView({
  tasks = [],
  projects = [],
  teamMembers = [],
  currentUser = null,
  onOpenCreateTask,
  onTaskClick,
  onToggleTaskComplete,
  onUpdateTaskStatus,
  onDeleteTask,
  searchQuery = '',
  onSwitchToTableView
}) {
  const dispatch = useDispatch();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState('ALL');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);
  const [addingTaskColId, setAddingTaskColId] = useState(null);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  const handleQuickCreateTask = (colId) => {
    if (!quickTaskTitle.trim()) return;
    const targetProject = projects.find((p) => p.id === selectedProject) || projects[0];
    const newTask = {
      id: 'tsk-' + Date.now(),
      title: quickTaskTitle.trim(),
      description: 'Quickly added from Kanban board.',
      projectId: targetProject?.id || 'proj-1',
      projectName: targetProject?.name || 'Workspace Initiative',
      status: colId,
      priority: 'MEDIUM',
      assigneeName: currentUser?.name || 'Rohan Verma',
      assigneeId: currentUser?.id || 'usr-1',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      progress: colId === 'DONE' ? 100 : 0,
      subtasks: [],
      comments: []
    };
    dispatch(addTask(newTask));
    setAddingTaskColId(null);
    setQuickTaskTitle('');
  };

  const query = (searchQuery || localSearch).toLowerCase().trim();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (query) {
        const matchesTitle = t.title?.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        const matchesProj = t.projectName?.toLowerCase().includes(query);
        const matchesAssignee = t.assigneeName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProj && !matchesAssignee) {
          return false;
        }
      }

      if (selectedProject !== 'ALL' && t.projectId !== selectedProject) {
        return false;
      }

      if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) {
        return false;
      }

      if (selectedAssignee !== 'ALL' && t.assigneeId !== selectedAssignee && t.assigneeName !== selectedAssignee) {
        return false;
      }

      if (onlyMyTasks && currentUser) {
        const matchId = t.assigneeId === currentUser.id;
        const matchName =
          t.assigneeName &&
          currentUser.name &&
          t.assigneeName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
        if (!matchId && !matchName) return false;
      }

      return true;
    });
  }, [tasks, query, selectedProject, selectedPriority, selectedAssignee, onlyMyTasks, currentUser]);

  const tasksByColumn = useMemo(() => {
    const groups = {
      'TO DO': [],
      'IN PROGRESS': [],
      'REVIEW': [],
      'DONE': []
    };

    filteredTasks.forEach((t) => {
      const colId = groups[t.status] ? t.status : 'TO DO';
      groups[colId].push(t);
    });

    return groups;
  }, [filteredTasks]);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColId(null);
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetColId) {
      if (onUpdateTaskStatus) {
        onUpdateTaskStatus(taskId, targetColId);
      }
      if (targetColId === 'DONE') {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (err) { }
      }
    }
  };

  const handleQuickMove = (taskId, newStatus) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, newStatus);
    }
    if (newStatus === 'DONE') {
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 }
        });
      } catch (err) { }
    }
  };

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN PROGRESS').length;
  const completionPercentage =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="page-content kanban-page-content">
      <div className="page-header kanban-page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1>Kanban Board</h1>
            <span className="kanban-stat-badge">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <p>
            Interactive workflow board. Drag and drop tasks between columns to update sprint progress in real-time.
          </p>
        </div>

        <div className="page-header-actions">
          {onSwitchToTableView && (
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
              <button
                type="button"
                onClick={onSwitchToTableView}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Switch to Table view"
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'default'
                }}
              >
                <LayoutGrid size={14} />
                <span>Kanban Board</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={() => onOpenCreateTask && onOpenCreateTask('TO DO')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="kanban-stats-bar">
        <div className="kanban-stat-item">
          <span className="kanban-stat-number">{tasksByColumn['TO DO']?.length || 0}</span>
          <span className="kanban-stat-label">To Do</span>
        </div>
        <div className="kanban-stat-divider" />
        <div className="kanban-stat-item">
          <span className="kanban-stat-number" style={{ color: 'var(--warning)' }}>
            {inProgressCount}
          </span>
          <span className="kanban-stat-label">In Progress</span>
        </div>
        <div className="kanban-stat-divider" />
        <div className="kanban-stat-item">
          <span className="kanban-stat-number" style={{ color: '#8B5CF6' }}>
            {tasksByColumn['REVIEW']?.length || 0}
          </span>
          <span className="kanban-stat-label">Review</span>
        </div>
        <div className="kanban-stat-divider" />
        <div className="kanban-stat-item">
          <span className="kanban-stat-number" style={{ color: 'var(--success)' }}>
            {completedTasksCount}
          </span>
          <span className="kanban-stat-label">Done</span>
        </div>
        <div className="kanban-stat-divider" />
        <div className="kanban-stat-progress-box">
          <div className="kanban-stat-progress-meta">
            <span>Sprint Velocity</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{completionPercentage}%</span>
          </div>
          <div className="progress-track" style={{ height: '6px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${completionPercentage}%`,
                background: completionPercentage === 100 ? 'var(--success)' : 'var(--primary)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="kanban-controls-bar">
        <div className="kanban-search-wrap">
          <Search size={15} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Filter tasks by name, assignee, project..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="kanban-filters-group">
          <select
            className="form-select kanban-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="form-select kanban-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MED">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            className="form-select kanban-select"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
          >
            <option value="ALL">All Members</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`btn-secondary btn-sm kanban-my-tasks-btn ${onlyMyTasks ? 'active' : ''}`}
            onClick={() => setOnlyMyTasks(!onlyMyTasks)}
          >
            <User size={13} />
            <span>My Tasks</span>
          </button>

          {(localSearch || selectedProject !== 'ALL' || selectedPriority !== 'ALL' || selectedAssignee !== 'ALL' || onlyMyTasks) && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => {
                setLocalSearch('');
                setSelectedProject('ALL');
                setSelectedPriority('ALL');
                setSelectedAssignee('ALL');
                setOnlyMyTasks(false);
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="kanban-board-grid">
        {COLUMNS.map((col) => {
          const colTasks = tasksByColumn[col.id] || [];
          const isDragOver = dragOverColId === col.id;

          return (
            <div
              key={col.id}
              className={`kanban-column ${isDragOver ? 'is-drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="kanban-column-header">
                <div className="kanban-col-title-wrap">
                  <span
                    className="kanban-col-color-dot"
                    style={{ background: col.color }}
                  />
                  <h3 className="kanban-col-title">{col.title}</h3>
                  <span className="kanban-col-count">{colTasks.length}</span>
                </div>

                <button
                  type="button"
                  className="kanban-col-add-btn"
                  onClick={() => {
                    if (addingTaskColId === col.id) {
                      setAddingTaskColId(null);
                    } else {
                      setAddingTaskColId(col.id);
                      setQuickTaskTitle('');
                    }
                  }}
                  title={`Add new task to ${col.title}`}
                  aria-label={`Add task to ${col.title}`}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="kanban-col-subtitle">{col.subtitle}</div>

              <div className="kanban-cards-list">
                {colTasks.length === 0 && addingTaskColId !== col.id && (
                  <div className="kanban-col-empty">
                    <div className="kanban-empty-dash" />
                    <span>Drop tasks here</span>
                  </div>
                )}
                {colTasks.map((task) => {
                    const isDone = task.status === 'DONE';
                    const isBeingDragged = draggedTaskId === task.id;
                    const totalSubtasks = task.subtasks?.length || 0;
                    const completedSubtasks = task.subtasks?.filter((s) => s.done).length || 0;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`kanban-task-card ${isBeingDragged ? 'is-dragging' : ''
                          } ${isDone ? 'is-done' : ''}`}
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        <div className="kanban-card-top">
                          <span
                            className="kanban-card-proj-pill"
                            title={task.projectName}
                          >
                            <Folder size={11} />
                            <span>{task.projectName}</span>
                          </span>

                          <span
                            className={`priority-tag priority-${task.priority.toLowerCase()}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4
                          className={`kanban-card-title ${isDone ? 'strikethrough' : ''
                            }`}
                        >
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="kanban-card-desc">{task.description}</p>
                        )}

                        {totalSubtasks > 0 && (
                          <div className="kanban-card-subtasks-wrap">
                            <div className="kanban-card-subtasks-meta">
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <CheckSquare size={11} />
                                <span>Subtasks</span>
                              </span>
                              <span>
                                {completedSubtasks}/{totalSubtasks}
                              </span>
                            </div>
                            <div className="progress-track" style={{ height: '4px' }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${Math.round(
                                    (completedSubtasks / totalSubtasks) * 100
                                  )}%`,
                                  background:
                                    completedSubtasks === totalSubtasks
                                      ? 'var(--success)'
                                      : 'var(--primary)'
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="kanban-card-footer">
                          <div
                            className="kanban-card-assignee"
                            title={`Assigned to: ${task.assigneeName || 'Unassigned'}`}
                          >
                            <div className="kanban-assignee-avatar">
                              {task.assigneeName
                                ? task.assigneeName.slice(0, 2).toUpperCase()
                                : 'ME'}
                            </div>
                            <span className="kanban-assignee-name">
                              {task.assigneeName?.split(' ')[0] || 'Unassigned'}
                            </span>
                          </div>

                          {task.dueDate && (
                            <div
                              className="kanban-card-due"
                              title={`Due: ${task.dueDate}`}
                            >
                              <Calendar size={11} />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}

                          <div
                            className="kanban-card-status-select-wrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={task.status}
                              onChange={(e) => handleQuickMove(task.id, e.target.value)}
                              className="kanban-card-quick-select"
                              title="Move task to another column"
                            >
                              <option value="TO DO">To Do</option>
                              <option value="IN PROGRESS">In Progress</option>
                              <option value="REVIEW">Review</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {addingTaskColId === col.id ? (
                  <div className="kanban-inline-add-card">
                    <input
                      type="text"
                      className="kanban-inline-input"
                      placeholder="What needs to be done? Press Enter..."
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickCreateTask(col.id);
                        } else if (e.key === 'Escape') {
                          setAddingTaskColId(null);
                          setQuickTaskTitle('');
                        }
                      }}
                      autoFocus
                    />
                    <div className="kanban-inline-actions">
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={() => handleQuickCreateTask(col.id)}
                      >
                        Add Task
                      </button>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => {
                          setAddingTaskColId(null);
                          setQuickTaskTitle('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="kanban-add-card-btn"
                    onClick={() => {
                      setAddingTaskColId(col.id);
                      setQuickTaskTitle('');
                    }}
                  >
                    <Plus size={14} />
                    <span>Add task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanView;
