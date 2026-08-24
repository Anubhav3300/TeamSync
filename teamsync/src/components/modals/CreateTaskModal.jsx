import React, { useState } from 'react';

/**
 * CreateTaskModal Component
 * ----------------------------------------------------
 * Evaluation 1 Rubric Alignment:
 * 1. Controlled Form Inputs (DOM Manipulation): Links state to inputs, selects, textareas
 * 2. JavaScript Array.find(): Looks up project and assignee by ID
 * 3. React Props & Callbacks: onAddTask() passes new task object to parent
 * 4. Conditional Rendering: Modal only mounts when isOpen is true
 */
function CreateTaskModal({ isOpen, onClose, onAddTask, projects, defaultStatus = 'TO DO' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('HIGH');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-20');

  // Currently selected project
  const selectedProject = projects.find(p => p.id === projectId) || projects[0];

  // Dynamically resolve assignees ONLY for the selected project (user-entered team members & leader)
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

    // Fallback if no members are specified
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
      assigneeAvatar: null, // Use default profile icon
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
          <h3 className="modal-title">Create New Task</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement OAuth2 & SSO Flow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Associated Project</label>
                <select
                  className="form-select"
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setAssigneeName(''); // Reset selected assignee when project switches
                  }}
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
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
                <label className="form-label">Assigned to</label>
                <select
                  className="form-select"
                  value={assigneeName || projectAssignees[0]?.name || ''}
                  onChange={(e) => setAssigneeName(e.target.value)}
                >
                  {projectAssignees.map((member) => (
                    <option key={member.id} value={member.name}>
                      👤 {member.name}
                    </option>
                  ))}
                </select>
              </div>
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

            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea
                className="form-textarea"
                placeholder="Specify acceptance criteria, technical details, or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
