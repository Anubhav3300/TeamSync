import React, { useState } from 'react';
import { Search, Plus, Trash2, Folder, FolderPlus, MoreVertical, CheckSquare, Sparkles, User } from 'lucide-react';

/**
 * ProjectsView Component
 * ----------------------------------------------------
 * High-end enterprise projects catalog with Lucide icons.
 */
function ProjectsView({
  projects,
  onOpenCreateProject,
  onSelectProject,
  onDeleteProject,
  onClearAllProjects,
  onLoadSampleData,
  teamMembers,
  searchQuery
}) {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [localSearch, setLocalSearch] = useState('');

  const query = searchQuery || localSearch;

  // Filter projects by tab status & search term
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.category.toLowerCase().includes(query.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'All Projects') return true;
    if (activeFilter === 'Active') return project.status === 'Active' || project.status === 'Planning';
    if (activeFilter === 'Completed') return project.status === 'Completed' || project.progress === 100;
    if (activeFilter === 'On Hold') return project.status === 'In Review' || project.status === 'Review' || project.status === 'On Hold';
    return true;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Projects ({projects.length})</h1>
          <p>Manage, prioritize, and monitor your team's ongoing project deliverables.</p>
        </div>

        <div className="page-header-actions">
          <div className="nav-search-container" style={{ width: '220px' }}>
            <Search size={15} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search projects..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {projects.length > 0 && onClearAllProjects && (
            <button
              className="btn-secondary"
              onClick={onClearAllProjects}
              title="Clear all projects to start fresh"
              style={{ color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          )}

          <button className="btn-primary" onClick={onOpenCreateProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="projects-filter-bar">
        {['All Projects', 'Active', 'Completed', 'On Hold'].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '14px' }}>
            <FolderPlus size={32} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>No projects found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            Try adjusting your search criteria or create a brand new project to get started.
          </p>
          <button className="btn-primary" onClick={onOpenCreateProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
            <Plus size={16} />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className="projects-cards-grid">
          {filteredProjects.map((project) => {
            const statusClass =
              project.status === 'Active' ? 'status-active' :
              project.status === 'In Review' || project.status === 'Review' ? 'status-review' :
              project.status === 'Completed' ? 'status-completed' : 'status-planning';

            const priorityClass =
              project.priority === 'High' ? 'priority-high' :
              project.priority === 'Medium' ? 'priority-med' : 'priority-low';

            const resolvedMembers = project.members?.map((m) => {
              if (typeof m === 'string') {
                const found = teamMembers.find(tm => tm.id === m || tm.name.toLowerCase() === m.toLowerCase());
                if (found) return { name: found.name, avatar: found.avatar, initials: found.initials };
                const initials = m.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || m.slice(0, 2).toUpperCase();
                return { name: m, avatar: null, initials };
              }
              return { name: m.name || 'Member', avatar: m.avatar, initials: 'TM' };
            }) || [];

            return (
              <div key={project.id} className="project-card">
                <div>
                  {/* Card Header */}
                  <div className="project-card-header">
                    <div className="project-card-badges">
                      <span className={`status-pill ${statusClass}`}>
                        <span className="status-pill-dot" />
                        {project.status}
                      </span>
                      <span className={`priority-tag ${priorityClass}`}>
                        {project.priority === 'High' ? '↑ High' : project.priority}
                      </span>
                    </div>

                    <button
                      style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete project "${project.name}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      title="Delete Project"
                    >
                      <Trash2 size={15} style={{ color: 'var(--text-subtle)' }} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="project-card-title">{project.name}</h3>
                  <p className="project-card-desc">{project.description}</p>
                  
                  {/* Team Leader Badge */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} style={{ color: 'var(--text-subtle)' }} />
                    <span style={{ fontWeight: 600 }}>Lead:</span>
                    <span>{project.manager || 'Unassigned'}</span>
                  </div>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="project-card-progress">
                    <div className="project-progress-header">
                      <span className="project-progress-label">Progress</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {project.progress}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${project.progress}%`,
                          background: project.progress > 80 ? 'var(--success)' : 'var(--primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="project-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar-stack">
                        {resolvedMembers.slice(0, 3).map((mem, idx) => (
                          mem.avatar ? (
                            <img key={idx} src={mem.avatar} alt={mem.name} title={mem.name} />
                          ) : (
                            <div
                              key={idx}
                              className="avatar-initials"
                              style={{ background: 'var(--primary)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700 }}
                              title={mem.name}
                            >
                              {mem.initials}
                            </div>
                          )
                        ))}
                        {resolvedMembers.length > 3 && (
                          <div className="avatar-initials">+{resolvedMembers.length - 3}</div>
                        )}
                      </div>

                      <span className="project-task-stat" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckSquare size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{project.completedTasks}/{project.totalTasks || project.completedTasks}</span>
                      </span>
                    </div>

                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => onSelectProject(project)}
                    >
                      View Project
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectsView;
