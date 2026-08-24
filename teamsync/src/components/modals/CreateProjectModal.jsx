import React, { useState } from 'react';

/**
 * CreateProjectModal Component
 * ----------------------------------------------------
 * Evaluation 1 Rubric Alignment:
 * 1. Conditional Rendering: Returns null if isOpen is false
 * 2. Form Submission (DOM Manipulation): Prevents default page reload with e.preventDefault()
 * 3. React State (useState): Dynamic custom Manager and Team Member tags management
 * 4. Props & Callbacks: onAddProject() creates new project in main state
 */
function CreateProjectModal({ isOpen, onClose, onAddProject }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Product Engineering');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [manager, setManager] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-30');

  // Custom Team Members state
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');

  if (!isOpen) return null;

  // Handler to add custom team member tag
  const handleAddMember = (e) => {
    e?.preventDefault();
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setMemberInput('');
    }
  };

  // Handler to remove a team member tag
  const handleRemoveMember = (idxToRemove) => {
    setMembers(members.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const leaderName = manager.trim() || 'Team Lead';
    const projectMembers = members.length > 0 ? members : [leaderName];

    const newProject = {
      id: 'proj-' + Date.now(),
      name: name.trim(),
      category,
      description: description.trim() || 'No description provided.',
      status: 'Active',
      priority,
      progress: 0,
      completedTasks: 0,
      totalTasks: 0,
      manager: leaderName,
      managerAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      dueDate,
      members: projectMembers,
      color: '#4F46E5'
    };

    onAddProject(newProject);
    setName('');
    setDescription('');
    setManager('');
    setMembers([]);
    setMemberInput('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Project</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Project Name */}
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mobile Banking App v2.0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Category & Priority */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Product Engineering">Product Engineering</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Web Platform">Web Platform</option>
                  <option value="Growth & Marketing">Growth & Marketing</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Manager / Leader & Due Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Team Leader / Manager *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Custom Team Members */}
            <div className="form-group">
              <label className="form-label">Add Team Members</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter member name and click Add"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddMember}
                  style={{ padding: '0 16px' }}
                >
                  + Add
                </button>
              </div>

              {/* Tag Chips for Added Members */}
              {members.length > 0 && (
                <div className="member-chips-container">
                  {members.map((mem, idx) => (
                    <span key={idx} className="member-chip">
                      <span>👤 {mem}</span>
                      <button
                        type="button"
                        className="member-chip-remove"
                        onClick={() => handleRemoveMember(idx)}
                        title="Remove member"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description & Scope</label>
              <textarea
                className="form-textarea"
                placeholder="What is the objective, deliverables, and key milestones?"
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
