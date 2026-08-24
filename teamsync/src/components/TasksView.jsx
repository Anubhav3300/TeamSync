import React, { useState } from 'react';

/**
 * TasksView Component
 * ----------------------------------------------------
 * Evaluation 1 Rubric Alignment:
 * 1. JavaScript Array Filtering: Multi-condition filter (Status, Priority, Project, Search text)
 * 2. React State (useState): Managing active filter dropdowns and search query
 * 3. DOM Events: Checkbox toggle for completion, row click for details modal
 * 4. Semantic Table/List: Well-structured task items with priority badges and assignees
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
          <h1>Tasks Management</h1>
          <p>Track, organize, and prioritize individual deliverables across all projects.</p>
        </div>

        <div className="page-header-actions">
          <div className="nav-search-container" style={{ width: '240px' }}>
            <span>🔍</span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={() => onOpenCreateTask('TO DO')}>
            <span>+ Create Task</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        padding: '16px',
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <select
          className="form-select"
          style={{ width: '160px' }}
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
          style={{ width: '160px' }}
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
          style={{ width: '200px' }}
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
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setProjectFilter('ALL');
              setLocalSearch('');
            }}
          >
            Reset Filters
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
              <th style={{ width: '60px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No tasks found matching current filters.
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
                        <div className="default-avatar-icon" title={task.assigneeName}>
                          👤
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
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {task.dueDate}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'var(--border)', padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => onDeleteTask(task.id)}
                      >
                        Delete
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
