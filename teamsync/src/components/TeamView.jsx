import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Trash2,
  Plus,
  X,
  Send,
  Users,
  ShieldCheck,
  Mail,
  Activity,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  Folder,
  Sliders,
  CheckCircle2,
  BarChart2,
  Zap,
  Info
} from 'lucide-react';

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

  // Filters & Search for Team Members
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Expanded member deliverables accordions { [memberId]: boolean }
  const [expandedMembers, setExpandedMembers] = useState({});

  // Local capacity overrides if user adjusts capacity live
  const [capacityOverrides, setCapacityOverrides] = useState({});

  // Graph state for Bandwidth Utilization section: 'BAR_CHART' | 'TREND_CURVE'
  const [graphType, setGraphType] = useState('BAR_CHART');
  const [chartSortBy, setChartSortBy] = useState('UTILIZATION_DESC'); // 'UTILIZATION_DESC' | 'UTILIZATION_ASC' | 'NAME'
  const [hoveredMemberId, setHoveredMemberId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const toggleMemberAccordion = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };


  // Associate tasks with each team member to compute live bandwidth
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

      // Active vs Completed
      const activeTasksList = memberTasks.filter((t) => t.status !== 'DONE');
      const completedTasksList = memberTasks.filter((t) => t.status === 'DONE');

      // If tasks exist in workspace for this member, use real counts; otherwise fallback to member defaults
      const activeCount = memberTasks.length > 0 ? activeTasksList.length : member.activeTasks || 0;
      const completedCount = completedTasksList.length;
      const totalAssigned = activeCount + completedCount;

      const effectiveCapacity =
        capacityOverrides[member.id] !== undefined
          ? capacityOverrides[member.id]
          : member.maxCapacity || 15;

      const bandwidthPercentage = Math.min(100, Math.round((activeCount / effectiveCapacity) * 100));

      // Workload classification
      let bandwidthStatus = 'optimal'; // 'heavy' | 'optimal' | 'available'
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
  }, [teamMembers, tasks, capacityOverrides]);

  // Overall Team Bandwidth Summary
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

  // Filtered members list for directory cards
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

  // Sorted members list specifically for the Graph View
  const sortedMembersForChart = useMemo(() => {
    const list = [...membersWithMetrics];
    if (chartSortBy === 'UTILIZATION_DESC') {
      return list.sort((a, b) => b.bandwidthPercentage - a.bandwidthPercentage);
    } else if (chartSortBy === 'UTILIZATION_ASC') {
      return list.sort((a, b) => a.bandwidthPercentage - b.bandwidthPercentage);
    } else if (chartSortBy === 'NAME') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [membersWithMetrics, chartSortBy]);

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

  // Active member for capacity tuning in the graph section
  const currentTuningMember = useMemo(() => {
    const targetId = selectedMemberId || hoveredMemberId || (membersWithMetrics[0] && membersWithMetrics[0].id);
    return membersWithMetrics.find((m) => m.id === targetId) || membersWithMetrics[0] || null;
  }, [selectedMemberId, hoveredMemberId, membersWithMetrics]);

  return (
    <div className="page-content team-page-content">
      {/* 1. Page Header */}
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

      {/* 2. Filter and Search Bar for Team Directory */}
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
          {/* Department Filter */}
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

      {/* 3. Team Members Grid (Clean profile cards without bandwidth meter or deliverables progress) */}
      <div className="team-cards-grid">
        {filteredMembers.map((member) => {
          const isCurrentUser =
            currentUser &&
            (member.id === currentUser.id || member.email === currentUser.email);
          const isExpanded = !!expandedMembers[member.id];

          return (
            <div key={member.id} className="card team-member-card">
              {/* Member Top Info */}
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

              {/* Assigned Tasks Accordion Toggle */}
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

              {/* Card Footer Actions */}
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

        {/* Invite Member Action Card */}
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

      {/* 4. BANDWIDTH UTILIZATION SECTION (DISPLAYED AFTER TEAM MEMBERS - GRAPH BASED) */}
      <div className="team-bandwidth-graph-section card">
        {/* Section Header */}
        <div className="bandwidth-graph-header">
          <div className="bandwidth-graph-title-group">
            <div className="bandwidth-graph-icon-box">
              <BarChart2 size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="bandwidth-graph-title">Team Bandwidth Utilization Analytics</h2>
                <span
                  className={`team-bandwidth-overall-badge ${
                    teamSummary.totalBandwidthPct > 85
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
                Interactive workload capacity graphs and sprint throughput tracking
              </p>
            </div>
          </div>

          {/* Graph Type Switcher Controls (Bar Chart & Sprint Trend) */}
          <div className="bandwidth-graph-controls">
            <div className="bandwidth-graph-nav-pills">
              <button
                type="button"
                className={`graph-nav-btn ${graphType === 'BAR_CHART' ? 'active' : ''}`}
                onClick={() => setGraphType('BAR_CHART')}
                title="Member Workload vs Capacity Bar Chart"
              >
                <BarChart2 size={14} />
                <span>Capacity Bar Chart</span>
              </button>

              <button
                type="button"
                className={`graph-nav-btn ${graphType === 'TREND_CURVE' ? 'active' : ''}`}
                onClick={() => setGraphType('TREND_CURVE')}
                title="Sprint Workload Trend"
              >
                <TrendingUp size={14} />
                <span>Sprint Workload Trend</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bandwidth Analytics KPI Cards Row (Clean 3-Card Summary) */}
        <div className="bandwidth-kpi-summary-row">
          <div className="bandwidth-kpi-card">
            <span className="b-kpi-title">Active Workload Load</span>
            <div className="b-kpi-val">
              {teamSummary.totalActive}{' '}
              <span className="b-kpi-sub-unit">/ {teamSummary.totalCapacity} Tasks</span>
            </div>
            <div className="progress-track" style={{ height: '5px', marginTop: '6px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${teamSummary.totalBandwidthPct}%`,
                  background:
                    teamSummary.totalBandwidthPct > 85
                      ? 'var(--danger)'
                      : teamSummary.totalBandwidthPct > 70
                      ? 'var(--warning)'
                      : 'var(--primary)'
                }}
              />
            </div>
            <span className="b-kpi-foot">{teamSummary.availableSlots} task slots available</span>
          </div>

          <div className="bandwidth-kpi-card">
            <span className="b-kpi-title">Workload Health Balance</span>
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
            <div className="progress-track" style={{ height: '5px', marginTop: '6px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${teamSummary.totalCapacity > 0 ? Math.round((teamSummary.availableSlots / teamSummary.totalCapacity) * 100) : 0}%`,
                  background: '#3B82F6'
                }}
              />
            </div>
            <span className="b-kpi-foot">Free slots ready for new task assignments</span>
          </div>
        </div>

        {/* GRAPH VIEW 1: MEMBER WORKLOAD VS CAPACITY COMPARATIVE BAR CHART */}
        {graphType === 'BAR_CHART' && (
          <div className="bandwidth-chart-wrapper">
            <div className="chart-legend-row">
              <div className="chart-legend-items">
                <span className="chart-legend-indicator" style={{ background: '#3B82F6' }} />
                <span className="chart-legend-text">Active Assigned Tasks</span>

                <span
                  className="chart-legend-indicator"
                  style={{ background: 'rgba(148, 163, 184, 0.25)', border: '1px dashed #94a3b8' }}
                />
                <span className="chart-legend-text">Maximum Capacity Limit</span>

                <span className="chart-legend-indicator" style={{ background: '#EF4444' }} />
                <span className="chart-legend-text">Over Capacity (&gt;85%)</span>
              </div>

              {/* Sorting Filter for Bar Chart */}
              <div className="chart-sort-controls">
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Sort:
                </span>
                <select
                  className="form-select chart-sort-select"
                  value={chartSortBy}
                  onChange={(e) => setChartSortBy(e.target.value)}
                >
                  <option value="UTILIZATION_DESC">Highest Bandwidth First</option>
                  <option value="UTILIZATION_ASC">Lowest Bandwidth First</option>
                  <option value="NAME">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* SVG Interactive Comparative Bar Chart */}
            <div className="svg-chart-container">
              {(() => {
                const members = sortedMembersForChart;
                const chartHeight = 220;
                const topPadding = 30;
                const bottomPadding = 50;
                const usableHeight = chartHeight - topPadding - bottomPadding;
                const maxVal = Math.max(25, ...members.map((m) => Math.max(m.effectiveCapacity, m.activeCount)));

                return (
                  <svg
                    className="bandwidth-svg-chart"
                    viewBox="0 0 1000 240"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="barGradientHeavy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#F87171" />
                      </linearGradient>
                      <linearGradient id="barGradientOptimal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                      const y = topPadding + usableHeight * (1 - ratio);
                      const taskLabel = Math.round(maxVal * ratio);
                      return (
                        <g key={i}>
                          <line
                            x1="50"
                            y1={y}
                            x2="980"
                            y2={y}
                            stroke="var(--border)"
                            strokeDasharray={ratio === 0 ? 'none' : '4 4'}
                            strokeWidth="1"
                          />
                          <text
                            x="40"
                            y={y + 4}
                            textAnchor="end"
                            fontSize="11"
                            fill="var(--text-subtle)"
                          >
                            {taskLabel}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars for Each Team Member */}
                    {members.map((m, idx) => {
                      const xBase = 60 + (idx * 900) / members.length;
                      const colWidth = Math.min(50, 800 / members.length);

                      const capHeight = (m.effectiveCapacity / maxVal) * usableHeight;
                      const capY = topPadding + usableHeight - capHeight;

                      const activeHeight = (m.activeCount / maxVal) * usableHeight;
                      const activeY = topPadding + usableHeight - activeHeight;

                      const isHovered = hoveredMemberId === m.id || selectedMemberId === m.id;
                      const barFill =
                        m.bandwidthStatus === 'heavy'
                          ? 'url(#barGradientHeavy)'
                          : m.bandwidthStatus === 'optimal'
                          ? 'url(#barGradientOptimal)'
                          : 'url(#barGradientPrimary)';

                      return (
                        <g
                          key={m.id}
                          className="chart-bar-group"
                          onMouseEnter={() => setHoveredMemberId(m.id)}
                          onMouseLeave={() => setHoveredMemberId(null)}
                          onClick={() => setSelectedMemberId(m.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Background Capacity Bar */}
                          <rect
                            x={xBase}
                            y={capY}
                            width={colWidth}
                            height={capHeight}
                            rx="5"
                            fill="rgba(148, 163, 184, 0.15)"
                            stroke="var(--border)"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />

                          {/* Foreground Active Workload Bar */}
                          <rect
                            x={xBase + 4}
                            y={activeY}
                            width={Math.max(8, colWidth - 8)}
                            height={activeHeight}
                            rx="4"
                            fill={barFill}
                            filter={isHovered ? 'brightness(1.15)' : 'none'}
                            style={{ transition: 'all 0.2s ease' }}
                          />

                          {/* Active tasks count on top of bar */}
                          <text
                            x={xBase + colWidth / 2}
                            y={activeY - 6}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill={isHovered ? 'var(--primary)' : 'var(--text-heading)'}
                          >
                            {m.activeCount}
                          </text>

                          {/* Member label below bar */}
                          <text
                            x={xBase + colWidth / 2}
                            y={topPadding + usableHeight + 16}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight={isHovered ? '700' : '500'}
                            fill={isHovered ? 'var(--primary)' : 'var(--text-main)'}
                          >
                            {m.name.split(' ')[0]}
                          </text>

                          {/* Percentage label */}
                          <text
                            x={xBase + colWidth / 2}
                            y={topPadding + usableHeight + 30}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill={
                              m.bandwidthStatus === 'heavy'
                                ? 'var(--danger)'
                                : m.bandwidthStatus === 'optimal'
                                ? 'var(--success)'
                                : 'var(--text-muted)'
                            }
                          >
                            {m.bandwidthPercentage}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Interactive Selected Member Inspector & Capacity Tuner */}
            {currentTuningMember && (
              <div className="chart-member-inspector-card">
                <div className="inspector-left">
                  <img
                    src={currentTuningMember.avatar}
                    alt={currentTuningMember.name}
                    className="inspector-avatar"
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="inspector-name">{currentTuningMember.name}</span>
                      <span className={`member-bandwidth-badge ${currentTuningMember.bandwidthStatus}`}>
                        {currentTuningMember.bandwidthStatus === 'heavy'
                          ? '🔴 Over Capacity'
                          : currentTuningMember.bandwidthStatus === 'optimal'
                          ? '🟢 Optimal Load'
                          : '🔵 Available Capacity'}
                      </span>
                    </div>
                    <div className="inspector-role-dept">
                      {currentTuningMember.role} • {currentTuningMember.department}
                    </div>
                  </div>
                </div>

                <div className="inspector-metrics">
                  <div className="inspector-metric-box">
                    <span className="i-metric-label">Active Tasks</span>
                    <span className="i-metric-val">{currentTuningMember.activeCount} tasks</span>
                  </div>
                  <div className="inspector-metric-box">
                    <span className="i-metric-label">Max Capacity</span>
                    <span className="i-metric-val">{currentTuningMember.effectiveCapacity} slots</span>
                  </div>
                  <div className="inspector-metric-box">
                    <span className="i-metric-label">Utilization</span>
                    <span className="i-metric-val">{currentTuningMember.bandwidthPercentage}%</span>
                  </div>
                  <div className="inspector-metric-box">
                    <span className="i-metric-label">Available Slots</span>
                    <span className="i-metric-val">
                      {Math.max(0, currentTuningMember.effectiveCapacity - currentTuningMember.activeCount)} slots
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GRAPH VIEW 2: SIMPLE & UNDERSTANDABLE SPRINT WORKLOAD TREND */}
        {graphType === 'TREND_CURVE' && (
          <div className="bandwidth-chart-wrapper">
            {/* Simple Legend & Context */}
            <div className="chart-legend-row">
              <div className="chart-legend-items">
                <span className="chart-legend-indicator" style={{ background: '#4F46E5' }} />
                <span className="chart-legend-text">Active Team Tasks</span>

                <span
                  className="chart-legend-indicator"
                  style={{ background: 'transparent', borderTop: '2px dashed #94a3b8' }}
                />
                <span className="chart-legend-text">Healthy Target Range (15-20 Tasks)</span>
              </div>
              <span className="sprint-trend-badge">
                📊 Steady Workload Pace
              </span>
            </div>

            {/* Intuitive SVG Line Chart */}
            <div className="svg-chart-container">
              {(() => {
                const sprintData = [
                  { label: 'Sprint 1', tasks: 10 },
                  { label: 'Sprint 2', tasks: 13 },
                  { label: 'Sprint 3', tasks: 16 },
                  { label: 'Sprint 4', tasks: 15 },
                  { label: 'Current Sprint', tasks: teamSummary.totalActive }
                ];

                // Scale chart comfortably so that values fill the chart cleanly (Y: 0 to 25 tasks)
                const yMax = Math.max(25, teamSummary.totalActive + 5);
                const chartH = 200;
                const padTop = 35;
                const padBot = 45;
                const usableH = chartH - padTop - padBot;

                const getPt = (val, idx) => {
                  const x = 90 + (idx * 820) / (sprintData.length - 1);
                  const y = padTop + usableH * (1 - val / yMax);
                  return { x, y };
                };

                const coords = sprintData.map((d, i) => getPt(d.tasks, i));

                // Generate clean polyline path
                const linePath = coords.reduce((acc, pt, i) => {
                  return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '');

                const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padTop + usableH} L ${coords[0].x} ${padTop + usableH} Z`;

                const targetY = padTop + usableH * (1 - 18 / yMax);

                return (
                  <svg className="bandwidth-svg-chart" viewBox="0 0 1000 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="simpleTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(79, 70, 229, 0.28)" />
                        <stop offset="100%" stopColor="rgba(79, 70, 229, 0.0)" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Steps: 0, 5, 10, 15, 20, 25 */}
                    {[0, 5, 10, 15, 20, yMax].map((stepVal, idx) => {
                      const y = padTop + usableH * (1 - stepVal / yMax);
                      return (
                        <g key={idx}>
                          <line
                            x1="60"
                            y1={y}
                            x2="960"
                            y2={y}
                            stroke="var(--border)"
                            strokeDasharray={stepVal === 0 ? 'none' : '4 4'}
                            strokeWidth="1"
                          />
                          <text x="52" y={y + 4} textAnchor="end" fontSize="11" fill="var(--text-subtle)">
                            {stepVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Target Benchmark Line (18 tasks) */}
                    <line
                      x1="60"
                      y1={targetY}
                      x2="960"
                      y2={targetY}
                      stroke="#94A3B8"
                      strokeDasharray="6 4"
                      strokeWidth="1.5"
                    />
                    <text x="955" y={targetY - 6} textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="600">
                      Optimal Sprint Target (~18 Tasks)
                    </text>

                    {/* Soft Area fill under the trend line */}
                    <path d={areaPath} fill="url(#simpleTrendGradient)" />

                    {/* The Primary Trend Line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Clear, readable Data Points */}
                    {sprintData.map((d, i) => {
                      const pt = coords[i];
                      const isCurrent = i === sprintData.length - 1;

                      return (
                        <g key={i}>
                          {/* Point Circle */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isCurrent ? '7' : '5'}
                            fill={isCurrent ? '#10B981' : '#4F46E5'}
                            stroke="#ffffff"
                            strokeWidth="2.5"
                          />

                          {/* Task Count Callout Pill */}
                          <rect
                            x={pt.x - 34}
                            y={pt.y - 28}
                            width="68"
                            height="18"
                            rx="9"
                            fill={isCurrent ? '#10B981' : '#4F46E5'}
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 16}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="800"
                            fill="#ffffff"
                          >
                            {d.tasks} {isCurrent ? 'Now' : 'Tasks'}
                          </text>

                          {/* X-Axis Sprint Label */}
                          <text
                            x={pt.x}
                            y={padTop + usableH + 22}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight={isCurrent ? '800' : '600'}
                            fill={isCurrent ? 'var(--primary)' : 'var(--text-main)'}
                          >
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Simple Under-the-Chart Guide */}
            <div className="sprint-guide-card">
              <div className="sprint-guide-item">
                <span className="sprint-guide-label">Current Workload:</span>
                <span className="sprint-guide-val" style={{ color: 'var(--primary)' }}>
                  {teamSummary.totalActive} Active Tasks
                </span>
              </div>
              <div className="sprint-guide-item">
                <span className="sprint-guide-label">Average per Sprint:</span>
                <span className="sprint-guide-val">~14 Tasks</span>
              </div>
              <div className="sprint-guide-item">
                <span className="sprint-guide-label">Capacity Status:</span>
                <span className="sprint-guide-val" style={{ color: '#10B981' }}>
                  Healthy & Within Capacity
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
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
      )}
    </div>
  );
}

export default TeamView;
