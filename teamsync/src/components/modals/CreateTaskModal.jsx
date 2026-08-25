import React, { useState } from 'react';
import { X, Plus, ListTodo } from 'lucide-react';

function CreateTaskModal({ isOpen, onClose, onAddTask, projects, defaultStatus = 'TO DO' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('HIGH');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-20');

  const selectedProject = projects.find(p => p.id === projectId) || projects[0];

  const projectAssignees = React.useMemo(() => {
    const map = new Map();
    const addMember = (raw) => {
      if (!raw) return;
      if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed) {
          map.set(trimmed.toLowerCase(), {
            id: 'usr-' + trimmed.toLowerCase().replace(/\s+/g, '-'),
            name: trimmed
          });
        }
      } else if (raw.name) {
        map.set(raw.name.toLowerCase(), {
          id: raw.id || 'usr-' + raw.name.toLowerCase().replace(/\s+/g, '-'),
          name: raw.name
        });
      }
    };

    if (selectedProject) {
      if (selectedProject.manager) addMember(selectedProject.manager);
      if (Array.isArray(selectedProject.members)) selectedProject.members.forEach(addMember);
    }

    if (map.size === 0) {
      map.set('lead', { id: 'usr-lead', name: 'Team Lead' });
    }

    return Array.from(map.values());
  }, [selectedProject]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenAssignee =
      projectAssignees.find(m => m.name === assigneeName || m.id === assigneeName) ||
      projectAssignees[0] ||
      { id: 'usr-1', name: 'Unassigned' };

    const newTask = {
      id: 'tsk-' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'No additional details.',
      projectId: selectedProject?.id,
      projectName: selectedProject?.name || 'General Initiative',
      status: status || 'TO DO',
      priority,
      assigneeId: chosenAssignee.id,
      assigneeName: chosenAssignee.name,
      assigneeAvatar: null,
      dueDate,
      commentsCount: 0,
      attachmentsCount: 0,
      subtasks: [],
      comments: []
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setAssigneeName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListTodo size={20} style={{ color: 'var(--primary)' }} />
            <h3 className="modal-title">Create New Task</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project *</label>
                <select
                  className="form-select"
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setAssigneeName('');
                  }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select
                  className="form-select"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                >
                  <option value="">Select an assignee...</option>
                  {projectAssignees.map((mem) => (
                    <option key={mem.id} value={mem.name}>{mem.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status Stage</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="TO DO">TO DO</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MED">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Acceptance Criteria</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Detail technical requirements, expected deliverables..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
