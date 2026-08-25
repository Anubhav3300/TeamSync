import React, { useState } from 'react';
import { UserPlus, Trash2, Plus, X, Send, Users, ShieldCheck, Mail } from 'lucide-react';

function TeamView({
  teamMembers = [],
  currentUser,
  onAddTeamMember,
  onDeleteTeamMember,
  onOpenCreateTask
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [department, setDepartment] = useState('Engineering');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=4f46e5,3b82f6,10b981`,
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      activeTasks: 0,
      maxCapacity: 15,
      status: 'online'
    };

    onAddTeamMember(newMember);
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Team Directory ({teamMembers.length})</h1>
          <p>Collaborate, balance team capacity, and manage cross-functional ownership.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={16} />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {teamMembers.map((member) => {
          const isHeavy = member.activeTasks >= 15;
          const percent = Math.min(100, Math.round((member.activeTasks / member.maxCapacity) * 100));
          const isCurrentUser = currentUser && (member.id === currentUser.id || member.email === currentUser.email);

          return (
            <div key={member.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="workload-avatar-wrap">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span
                    className="workload-status-dot"
                    style={{
                      width: '12px',
                      height: '12px',
                      background:
                        member.status === 'online' ? '#10B981' :
                        member.status === 'busy' ? '#EF4444' : '#94A3B8'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {member.name}
                    </h3>
                    {isCurrentUser && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 700 }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {member.role}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {member.department}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Bandwidth Utilization</span>
                  <span style={{ fontWeight: 700, color: isHeavy ? 'var(--danger)' : 'var(--text-main)' }}>
                    {member.activeTasks} / {member.maxCapacity} Tasks ({percent}%)
                  </span>
                </div>
                <div className="workload-track">
                  <div
                    className={`workload-fill ${isHeavy ? 'heavy-load' : ''}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                {!isCurrentUser && onDeleteTeamMember ? (
                  <button
                    className="btn-sm"
                    style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => onDeleteTeamMember(member.id)}
                    title="Remove team member"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
                    <span>Workspace Owner</span>
                  </span>
                )}

                <button
                  className="btn-secondary btn-sm"
                  onClick={() => onOpenCreateTask('TO DO')}
                >
                  Assign Task
                </button>
              </div>
            </div>
          );
        })}

        <div
          className="card"
          onClick={() => setShowAddModal(true)}
          style={{
            border: '2px dashed var(--border)',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            cursor: 'pointer',
            textAlign: 'center',
            gap: '8px'
          }}
        >
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '4px' }}>
            <UserPlus size={24} />
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Invite New Member</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add developers, designers, or managers to your team</div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} style={{ color: 'var(--primary)' }} />
                <h3 className="modal-title">Invite New Team Member</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Johnathan Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="john@teamsync.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Lead Developer">Lead Developer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="UX Designer">UX Designer</option>
                      <option value="QA Tester">QA Tester</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Marketing Lead">Marketing Lead</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={15} />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamView;
