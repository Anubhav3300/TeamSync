import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, CheckSquare, MessageSquare, Plus, Check } from 'lucide-react';

function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onUpdateStatus,
  onAddComment,
  onToggleSubtask,
  onAddSubtask,
  onDeleteTask,
  currentUser,
  teamMembers = []
}) {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('TO DO');
  const [editedPriority, setEditedPriority] = useState('MED');
  const [editedAssigneeId, setEditedAssigneeId] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');

  const [commentText, setCommentText] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || '');
      setEditedDescription(task.description || '');
      setEditedStatus(task.status || 'TO DO');
      setEditedPriority(task.priority || 'MED');
      setEditedAssigneeId(task.assigneeId || '');
      setEditedDueDate(task.dueDate || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSaveChanges = () => {
    const selectedMember = teamMembers.find(m => m.id === editedAssigneeId);
    const updatedTask = {
      ...task,
      title: editedTitle.trim() || task.title,
      description: editedDescription.trim(),
      status: editedStatus,
      priority: editedPriority,
      assigneeId: editedAssigneeId || task.assigneeId,
      assigneeName: selectedMember ? selectedMember.name : (task.assigneeName || 'Unassigned'),
      assigneeAvatar: selectedMember ? selectedMember.avatar : task.assigneeAvatar,
      dueDate: editedDueDate || task.dueDate
    };

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    } else if (onUpdateStatus && editedStatus !== task.status) {
      onUpdateStatus(task.id, editedStatus);
    }
    onClose();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, {
      id: 'c-' + Date.now(),
      author: currentUser?.name || 'You',
      time: 'Just now',
      text: commentText.trim()
    });
    setCommentText('');
  };

  const handleSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    onAddSubtask(task.id, newSubtaskText.trim());
    setNewSubtaskText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: editedPriority === 'HIGH' ? '#EF4444' : editedPriority === 'MED' ? '#F59E0B' : '#10B981',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
            >
              <option value="HIGH">HIGH PRIORITY</option>
              <option value="MED">MED PRIORITY</option>
              <option value="LOW">LOW PRIORITY</option>
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.projectName}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Task Title</label>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '1.05rem', fontWeight: 700 }}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '12px',
            background: 'var(--bg-subtle)',
            borderRadius: '8px'
          }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                STATUS
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
              >
                <option value="TO DO">TO DO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                ASSIGNEE
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                value={editedAssigneeId}
                onChange={(e) => setEditedAssigneeId(e.target.value)}
              >
                <option value="">{task.assigneeName || 'Unassigned'}</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                DUE DATE
              </label>
              <input
                type="date"
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Description & Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Add details, links, or notes..."
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={15} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Checklist & Subtasks
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {task.subtasks?.filter(s => s.done).length || 0} of {task.subtasks?.length || 0} completed
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {task.subtasks?.map((st) => (
                <label
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => onToggleSubtask(task.id, st.id)}
                  />
                  <span style={{ textDecoration: st.done ? 'line-through' : 'none', color: st.done ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {st.text}
                  </span>
                </label>
              ))}
            </div>

            <form onSubmit={handleSubtaskSubmit} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                placeholder="Add an item to the checklist..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
              />
              <button type="submit" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={13} />
                <span>Add</span>
              </button>
            </form>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <MessageSquare size={15} style={{ color: 'var(--primary)' }} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Activity & Comments
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '160px', overflowY: 'auto' }}>
              {task.comments?.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>No comments yet. Be the first to leave one!</p>
              ) : (
                task.comments?.map((c) => (
                  <div key={c.id} style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{c.author}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn-primary btn-sm">Post</button>
            </form>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
          >
            <Trash2 size={14} />
            <span>Delete Task</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveChanges}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
