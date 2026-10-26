import React, { useState, useMemo } from 'react';
import { UserPlus, Trash2, Plus, X, Send, ShieldCheck, Search, RotateCcw, ChevronDown, ChevronUp, Clock, BarChart2 } from 'lucide-react';

function TeamView({
  teamMembers = [],
  currentUser,
  tasks = [],
  projects = [],
  onAddTeamMember,
  onDeleteTeamMember,
  onOpenCreateTask,
  onTaskClick,
  onToggleTaskComplete,
  onUpdateTaskStatus,
  showToast
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [department, setDepartment] = useState('Engineering');
  const [initialCapacity, setInitialCapacity] = useState(15);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleMemberAccordion = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };


  const membersWithMetrics = useMemo(() => {
    return teamMembers.map((member) => {
      const memberTasks = tasks.filter((t) => {
        const matchId = t.assigneeId === member.id;
        const matchName =
          t.assigneeName &&
          member.name &&
          t.assigneeName.toLowerCase().trim() === member.name.toLowerCase().trim();
        return matchId || matchName;
      });

      const activeTasksList = memberTasks.filter((t) => t.status !== 'DONE');
      const completedTasksList = memberTasks.filter((t) => t.status === 'DONE');

      const activeCount = memberTasks.length > 0 ? activeTasksList.length : member.activeTasks || 0;
      const completedCount = completedTasksList.length;
      const totalAssigned = activeCount + completedCount;

      const effectiveCapacity = member.maxCapacity || 15;
      const bandwidthPercentage = Math.min(100, Math.round((activeCount / effectiveCapacity) * 100));

      let bandwidthStatus = 'optimal';
      if (bandwidthPercentage >= 85) bandwidthStatus = 'heavy';
      else if (bandwidthPercentage < 40) bandwidthStatus = 'available';

      return {
        ...member,
        effectiveCapacity,
        activeCount,
        completedCount,
        totalAssigned,
        bandwidthPercentage,
        bandwidthStatus,
        assignedTasks: memberTasks,
        activeTasksList,
        completedTasksList
      };
    });
  }, [teamMembers, tasks]);

  const teamSummary = useMemo(() => {
    let totalActive = 0;
    let totalCapacity = 0;
    let heavyCount = 0;
    let optimalCount = 0;
    let availableCount = 0;

    membersWithMetrics.forEach((m) => {
      totalActive += m.activeCount;
      totalCapacity += m.effectiveCapacity;

      if (m.bandwidthStatus === 'heavy') heavyCount++;
      else if (m.bandwidthStatus === 'optimal') optimalCount++;
      else availableCount++;
    });

    const totalBandwidthPct =
      totalCapacity > 0 ? Math.min(100, Math.round((totalActive / totalCapacity) * 100)) : 0;

    const availableSlots = Math.max(0, totalCapacity - totalActive);

    return {
      totalActive,
      totalCapacity,
      totalBandwidthPct,
      availableSlots,
      heavyCount,
      optimalCount,
      availableCount
    };
  }, [membersWithMetrics]);

  const filteredMembers = useMemo(() => {
    return membersWithMetrics.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name?.toLowerCase().includes(q);
        const matchRole = m.role?.toLowerCase().includes(q);
        const matchDept = m.department?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchDept) return false;
      }

      if (departmentFilter !== 'ALL' && m.department !== departmentFilter) {
        return false;
      }

      return true;
    });
  }, [membersWithMetrics, searchQuery, departmentFilter]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name.trim()
      )}&backgroundColor=4f46e5,3b82f6,10b981`,
      initials: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      activeTasks: 0,
      maxCapacity: Number(initialCapacity) || 15,
      status: 'online'
    };

    onAddTeamMember(newMember);
    setName('');
    setEmail('');
    setShowAddModal(false);
    if (showToast) {
      showToast(`✨ ${name.trim()} added to the team directory!`);
    }
  };

  const departmentsList = useMemo(() => {
    const set = new Set();
    teamMembers.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set);
  }, [teamMembers]);

  return (
    <div className="page-content team-page-content">
      <div className="page-header team-page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1>Team Directory</h1>
            <span className="team-count-badge">
              {teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
          <p>
            Manage team members, roles, workload capacity limits, and cross-functional task assignments.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      <div className="team-controls-bar">
        <div className="team-search-wrap">
          <Search size={15} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search member by name, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="team-filters-group">
          <select
            className="form-select"
            style={{ width: '160px', height: '34px', fontSize: '0.8rem' }}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {(searchQuery || departmentFilter !== 'ALL') && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('ALL');
              }}
              title="Reset filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="team-cards-grid">
        {filteredMembers.map((member) => {
          const isCurrentUser =
            currentUser &&
            (member.id === currentUser.id || member.email === currentUser.email);
          const isExpanded = !!expandedMembers[member.id];

          return (
            <div key={member.id} className="card team-member-card">
              <div className="team-member-top-row">
                <div className="workload-avatar-wrap">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="team-member-avatar-img"
                  />
                  <span
                    className="workload-status-dot"
                    style={{
                      background:
                        member.status === 'online'
                          ? '#10B981'
                          : member.status === 'busy'
                            ? '#EF4444'
                            : '#94A3B8'
                    }}
                  />
                </div>

                <div className="team-member-identity">
                  <div className="team-member-name-row">
                    <h3 className="team-member-name">{member.name}</h3>
                    {isCurrentUser && <span className="team-member-you-badge">YOU</span>}
                  </div>
                  <div className="team-member-role">{member.role}</div>
                  <div className="team-member-dept">{member.department}</div>
                </div>
              </div>

              {member.activeTasksList.length > 0 ? (
                <div className="member-deliverables-accordion-wrap">
                  <button
                    type="button"
                    className="member-deliverables-toggle-btn"
                    onClick={() => toggleMemberAccordion(member.id)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} style={{ color: 'var(--primary)' }} />
                      <span>Assigned Tasks ({member.activeTasksList.length})</span>
                    </span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {isExpanded && (
                    <div className="member-deliverables-list">
                      {member.activeTasksList.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="member-deliverable-item"
                          onClick={() => onTaskClick && onTaskClick(task)}
                          title="Click to view task details"
                        >
                          <div className="member-deliverable-left">
                            <span
                              className={`priority-tag priority-${task.priority.toLowerCase()}`}
                            >
                              {task.priority}
                            </span>
                            <div className="member-deliverable-title-box">
                              <span className="member-deliverable-title">{task.title}</span>
                              <span className="member-deliverable-proj">{task.projectName}</span>
                            </div>
                          </div>
                          {task.dueDate && (
                            <span className="member-deliverable-due">
                              Due {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="member-no-tasks-hint">
                  <span>No active tasks currently assigned</span>
                </div>
              )}

              <div className="team-member-card-footer">
                {!isCurrentUser && onDeleteTeamMember ? (
                  <button
                    type="button"
                    className="team-member-remove-btn"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
                        onDeleteTeamMember(member.id);
                      }
                    }}
                    title="Remove team member"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                ) : (
                  <span className="team-member-owner-tag">
                    <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
                    <span>Workspace Lead</span>
                  </span>
                )}

                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => onOpenCreateTask && onOpenCreateTask('TO DO')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>Assign Task</span>
                </button>
              </div>
            </div>
          );
        })}

        <div
          className="card team-invite-card"
          onClick={() => setShowAddModal(true)}
        >
          <div className="team-invite-icon-box">
            <UserPlus size={24} />
          </div>
          <div className="team-invite-title">Invite New Member</div>
          <p className="team-invite-desc">
            Add developers, designers, or leads to scale your team deliverables
          </p>
        </div>
      </div>
      <div className="team-bandwidth-graph-section card">
        <div className="bandwidth-graph-header">
          <div className="bandwidth-graph-title-group">
            <div className="bandwidth-graph-icon-box">
              <BarChart2 size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="bandwidth-graph-title">Team Bandwidth & Capacity</h2>
                <span
                  className={`team-bandwidth-overall-badge ${teamSummary.totalBandwidthPct > 85
                      ? 'heavy'
                      : teamSummary.totalBandwidthPct < 40
                        ? 'available'
                        : 'optimal'
                    }`}
                >
                  {teamSummary.totalBandwidthPct}% Allocated
                </span>
              </div>
              <p className="bandwidth-graph-desc">
                Current task allocation and capacity across team members
              </p>
            </div>
          </div>
        </div>

        <div className="bandwidth-kpi-summary-row">
          <div className="bandwidth-kpi-card">
            <span className="b-kpi-title">Active Workload</span>
            <div className="b-kpi-val">
              {teamSummary.totalActive}{' '}
              <span className="b-kpi-sub-unit">/ {teamSummary.totalCapacity} Tasks</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(148, 163, 184, 0.25)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
              <div
                style={{
                  height: '6px',
                  width: `${teamSummary.totalBandwidthPct}%`,
                  background:
                    teamSummary.totalBandwidthPct > 85
                      ? 'var(--danger)'
                      : teamSummary.totalBandwidthPct > 70
                        ? 'var(--warning)'
                        : 'var(--primary)',
                  borderRadius: '3px'
                }}
              />
            </div>
            <span className="b-kpi-foot">{teamSummary.availableSlots} task slots available</span>
          </div>

          <div className="bandwidth-kpi-card">
            <span className="b-kpi-title">Workload Health</span>
            <div className="b-kpi-pills">
              <span className="health-pill optimal">🟢 {teamSummary.optimalCount} Optimal</span>
              <span className="health-pill heavy">🔴 {teamSummary.heavyCount} Heavy</span>
              <span className="health-pill available">🔵 {teamSummary.availableCount} Available</span>
            </div>
            <span className="b-kpi-foot">Capacity balance across {teamMembers.length} members</span>
          </div>

          <div className="bandwidth-kpi-card">
            <span className="b-kpi-title">Available Capacity</span>
            <div className="b-kpi-val" style={{ color: 'var(--primary)' }}>
              {teamSummary.availableSlots} Slots
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(148, 163, 184, 0.25)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
              <div
                style={{
                  height: '6px',
                  width: `${teamSummary.totalCapacity > 0 ? Math.round((teamSummary.availableSlots / teamSummary.totalCapacity) * 100) : 0}%`,
                  background: '#3B82F6',
                  borderRadius: '3px'
                }}
              />
            </div>
            <span className="b-kpi-foot">Free slots ready for new task assignments</span>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {membersWithMetrics.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                borderRadius: '10px',
                border: '1px solid var(--border)'
              }}
            >
              <img
                src={m.avatar}
                alt={m.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ minWidth: '150px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role} • {m.department}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{m.activeCount} / {m.effectiveCapacity} tasks assigned</span>
                  <span style={{ fontWeight: 600, color: m.bandwidthStatus === 'heavy' ? 'var(--danger)' : m.bandwidthStatus === 'optimal' ? 'var(--success)' : 'var(--text-main)' }}>
                    {m.bandwidthPercentage}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(148, 163, 184, 0.25)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '6px',
                      width: `${m.bandwidthPercentage}%`,
                      background:
                        m.bandwidthStatus === 'heavy'
                          ? '#EF4444'
                          : m.bandwidthStatus === 'optimal'
                          ? '#10B981'
                          : '#3B82F6',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
              <span
                className={`member-bandwidth-badge ${m.bandwidthStatus}`}
                style={{ minWidth: '85px', textAlign: 'center', padding: '3px 8px', fontSize: '0.72rem', borderRadius: '12px' }}
              >
                {m.bandwidthStatus === 'heavy' ? '🔴 Heavy' : m.bandwidthStatus === 'optimal' ? '🟢 Optimal' : '🔵 Available'}
              </span>
            </div>
          ))}
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
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowAddModal(false)}
              title="Close"
            >
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
                  placeholder="e.g. Maya Lin"
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
                  placeholder="maya@teamsync.io"
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
                    <option value="Fullstack Engineer">Fullstack Engineer</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="QA Tester">QA Tester</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
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

              <div className="form-group">
                <label className="form-label">Initial Task Bandwidth Capacity</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  className="form-input"
                  value={initialCapacity}
                  onChange={(e) => setInitialCapacity(e.target.value)}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Maximum active tasks this member can be assigned before being flagged as Over Capacity.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={15} />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
    </div >
  );
}

export default TeamView;
