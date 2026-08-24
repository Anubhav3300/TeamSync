import React, { useState } from 'react';
import { Search, Plus, Trash2, Filter, RotateCcw, CheckSquare, ListTodo, User, Calendar } from 'lucide-react';

/**
 * TasksView Component
 * ----------------------------------------------------
 * High-end enterprise task management table with Lucide React icons.
 */
function TasksView({
  tasks,
  projects,
  teamMembers,
  onOpenCreateTask,
  onTaskClick,
  onToggleTaskComplete,
  onDeleteTask,
  searchQuery
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');

  const query = searchQuery || localSearch;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.projectName.toLowerCase().includes(query.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(query.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (projectFilter !== 'ALL' && t.projectId !== projectFilter) return false;
    return true;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Task Deliverables ({tasks.length})</h1>
          <p>Track, organize, and prioritize individual task deliverables across all projects.</p>
        </div>

        <div className="page-header-actions">
          <div className="nav-search-container" style={{ width: '240px' }}>
            <Search size={15} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={() => onOpenCreateTask('TO DO')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px',
        padding: '14px 16px',
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Filter size={15} />
          <span>Filter:</span>
        </div>

        <select
          className="form-select"
          style={{ width: '150px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Status: All</option>
          <option value="TO DO">TO DO</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="REVIEW">REVIEW</option>
          <option value="DONE">DONE</option>
        </select>

        <select
          className="form-select"
          style={{ width: '150px' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">Priority: All</option>
          <option value="HIGH">High Priority</option>
          <option value="MED">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="ALL">Project: All</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || projectFilter !== 'ALL' || query) && (
          <button
            className="btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setProjectFilter('ALL');
              setLocalSearch('');
            }}
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Tasks Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="projects-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>TASK TITLE</th>
              <th>PROJECT</th>
              <th>ASSIGNEE</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>DUE DATE</th>
              <th style={{ width: '80px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--bg-subtle)', marginBottom: '10px' }}>
                    <ListTodo size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No tasks found</div>
                  <div style={{ fontSize: '0.85rem' }}>Try clearing filters or click "+ Create Task" above.</div>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const isDone = task.status === 'DONE';
                const priorityClass =
                  task.priority === 'HIGH' ? 'priority-high' :
                  task.priority === 'MED' ? 'priority-med' : 'priority-low';

                const statusClass =
                  task.status === 'TO DO' ? 'status-planning' :
                  task.status === 'IN PROGRESS' ? 'status-active' :
                  task.status === 'REVIEW' ? 'status-review' : 'status-completed';

                return (
                  <tr
                    key={task.id}
                    style={{ cursor: 'pointer', background: isDone ? 'var(--bg-subtle)' : 'transparent' }}
                    onClick={() => onTaskClick(task)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => onToggleTaskComplete(task.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {task.projectName}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="default-avatar-icon" title={task.assigneeName} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
                          {task.assigneeName ? task.assigneeName.slice(0, 2).toUpperCase() : <User size={12} />}
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>{task.assigneeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-tag ${priorityClass}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${statusClass}`}>
                        <span className="status-pill-dot" />
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{task.dueDate}</span>
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                      <button
                        className="btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'var(--border)', padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TasksView;
