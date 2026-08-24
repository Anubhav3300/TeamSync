import React, { useState } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';

/**
 * CreateProjectModal Component
 * ----------------------------------------------------
 * High-end modal for creating new initiatives with Lucide icons.
 */
function CreateProjectModal({ isOpen, onClose, onAddProject, teamMembers = [] }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Product Engineering');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [manager, setManager] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-30');

  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');

  if (!isOpen) return null;

  const handleAddMember = (e) => {
    e?.preventDefault();
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setMemberInput('');
    }
  };

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
      managerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(leaderName)}`,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={20} style={{ color: 'var(--primary)' }} />
            <h3 className="modal-title">Create New Project</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
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
                  placeholder="e.g. Rohan Verma"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  list="existing-leaders-suggestions"
                  required
                />
                <datalist id="existing-leaders-suggestions">
                  {(teamMembers || []).map(tm => (
                    <option key={tm.id} value={tm.name}>{tm.name} ({tm.role || 'Leader'})</option>
                  ))}
                </datalist>
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

            {/* Project Description */}
            <div className="form-group">
              <label className="form-label">Project Scope & Goals</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Outline objectives, milestone goals, or requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Team Members Tag Builder */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Project Team Members</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                  ✨ Auto-adds new members to Team Directory
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type name (e.g. Alex Morgan) and click Add..."
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  list="existing-team-suggestions"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <datalist id="existing-team-suggestions">
                  {(teamMembers || []).map(tm => (
                    <option key={tm.id} value={tm.name}>{tm.name} ({tm.role || 'Member'})</option>
                  ))}
                </datalist>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddMember}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions from existing team members not yet added */}
              {Array.isArray(teamMembers) && teamMembers.filter(tm => !members.includes(tm.name)).length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick add from team:</span>
                  {teamMembers.filter(tm => !members.includes(tm.name)).slice(0, 5).map(tm => (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => setMembers([...members, tm.name])}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      + {tm.name}
                    </button>
                  ))}
                </div>
              )}

              {members.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {members.map((mem, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 600
                      }}
                    >
                      <span>{mem}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
