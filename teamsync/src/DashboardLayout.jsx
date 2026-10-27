import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import TasksView from './components/TasksView';
import TeamView from './components/TeamView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import KanbanView from './components/KanbanView';
import NotificationsView from './components/NotificationsView';

import CreateProjectModal from './components/modals/CreateProjectModal';
import CreateTaskModal from './components/modals/CreateTaskModal';
import TaskDetailsModal from './components/modals/TaskDetailsModal';

import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// Redux Selectors & Actions
import {
  selectAllTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  toggleTaskComplete,
  deleteTask,
  deleteTasksByProject,
  addSubtask,
  toggleSubtask,
  addComment,
  resetTasks,
  clearTasks
} from './store/tasksSlice';

import {
  selectAllProjects,
  addProject,
  deleteProject,
  resetProjects,
  clearProjects
} from './store/projectsSlice';

import {
  selectAllTeamMembers,
  addTeamMember,
  deleteTeamMember,
  setTeamMembers,
  resetTeam
} from './store/teamSlice';

import {
  selectAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  resetNotifications
} from './store/notificationsSlice';

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Redux state
  const tasks = useSelector(selectAllTasks);
  const projects = useSelector(selectAllProjects);
  const teamMembers = useSelector(selectAllTeamMembers);
  const notifications = useSelector(selectAllNotifications);

  // Search & Modal UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState('TO DO');
  const [createTaskDefaultDueDate, setCreateTaskDefaultDueDate] = useState('');
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreateTask = (status = 'TO DO', dueDate = '') => {
    setCreateTaskDefaultStatus(status || 'TO DO');
    setCreateTaskDefaultDueDate(dueDate || '');
    setIsCreateTaskOpen(true);
  };

  // Sample data reset via Redux
  const handleLoadSampleData = () => {
    dispatch(resetProjects());
    dispatch(resetTasks());
    dispatch(resetTeam());
    dispatch(resetNotifications());
    if (currentUser?.isNewAccount) {
      updateUser({ isNewAccount: false });
    }
    showToast('✨ Demo sample data and team loaded successfully via Redux Toolkit!');
  };

  // Clear workspace via Redux
  const handleClearAllProjects = () => {
    dispatch(clearProjects());
    dispatch(clearTasks());
    dispatch(clearAllNotifications());
    setSelectedProject(null);
    setSelectedTaskDetails(null);

    const soloTeam = currentUser ? [
      {
        id: currentUser.id || 'usr-me',
        name: currentUser.name || 'Admin',
        email: currentUser.email || 'admin@teamsync.io',
        role: currentUser.role || 'Project Manager',
        avatar: currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || 'Admin')}`,
        initials: currentUser.initials || (currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME'),
        department: currentUser.department || 'Product',
        activeTasks: 0,
        maxCapacity: 15,
        status: 'online'
      }
    ] : [];

    dispatch(setTeamMembers(soloTeam));
    showToast('🧹 Workspace & Team cleared. You now have a clean slate!');
  };

  // Project handlers
  const handleAddProject = (newProj) => {
    dispatch(addProject(newProj));

    const projectMemberNames = Array.isArray(newProj.members) ? [...newProj.members] : [];
    if (newProj.manager && !projectMemberNames.includes(newProj.manager)) {
      projectMemberNames.push(newProj.manager);
    }

    const membersToAdd = [];
    projectMemberNames.forEach((rawName) => {
      if (!rawName || typeof rawName !== 'string') return;
      const cleanName = rawName.trim();
      if (!cleanName) return;

      const alreadyExists = teamMembers.some(
        (tm) => tm.id === cleanName || tm.name.toLowerCase().trim() === cleanName.toLowerCase().trim()
      );

      if (!alreadyExists) {
        const alreadyStaged = membersToAdd.some(
          (st) => st.name.toLowerCase().trim() === cleanName.toLowerCase().trim()
        );

        if (!alreadyStaged) {
          const nameParts = cleanName.split(' ');
          const initials = nameParts.map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'TM';
          const emailPrefix = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
          const isManager = cleanName.toLowerCase() === (newProj.manager || '').toLowerCase();

          let dept = 'Engineering';
          if (newProj.category?.toLowerCase().includes('design')) dept = 'Design';
          else if (newProj.category?.toLowerCase().includes('marketing') || newProj.category?.toLowerCase().includes('growth')) dept = 'Marketing';
          else if (newProj.category?.toLowerCase().includes('data') || newProj.category?.toLowerCase().includes('ai')) dept = 'Data & AI';
          else if (isManager) dept = 'Product';

          membersToAdd.push({
            id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: cleanName,
            email: `${emailPrefix || 'member'}@teamsync.io`,
            role: isManager ? 'Project Manager' : 'Developer',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
            initials: initials,
            department: dept,
            activeTasks: 0,
            maxCapacity: 15,
            status: 'online'
          });
        }
      }
    });

    if (membersToAdd.length > 0) {
      membersToAdd.forEach((m) => dispatch(addTeamMember(m)));
      showToast(`Project created & ${membersToAdd.length} member(s) added to Team Directory!`);
    } else {
      showToast(`Project "${newProj.name}" created!`);
    }
  };

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
    dispatch(deleteTasksByProject(projectId));
    if (selectedProject?.id === projectId) setSelectedProject(null);
    showToast('Project and linked tasks deleted.');
  };

  // Task handlers
  const handleAddTask = (newTask) => {
    dispatch(addTask(newTask));
    showToast(`Task "${newTask.title}" created successfully!`);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleToggleTaskComplete = (taskId) => {
    dispatch(toggleTaskComplete(taskId));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails((prev) => {
        const nextDone = prev.status !== 'DONE';
        return {
          ...prev,
          status: nextDone ? 'DONE' : 'IN PROGRESS',
          completed: nextDone,
          progress: nextDone ? 100 : Math.min(prev.progress || 50, 75)
        };
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails(null);
    }
    showToast('Task removed.');
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    if (selectedTaskDetails && selectedTaskDetails.id === updatedTask.id) {
      setSelectedTaskDetails(updatedTask);
    }
    showToast('Task updated.');
  };

  const handleAddComment = (taskId, comment) => {
    dispatch(addComment({ taskId, comment }));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
    }
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    dispatch(toggleSubtask({ taskId, subtaskId }));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails((prev) => {
        const updated = (prev.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const doneCount = updated.filter((s) => s.completed).length;
        const progress = Math.round((doneCount / updated.length) * 100);
        return {
          ...prev,
          subtasks: updated,
          progress,
          status: progress === 100 ? 'DONE' : prev.status
        };
      });
    }
  };

  const handleAddSubtask = (taskId, title) => {
    const newSt = {
      id: 'st-' + Date.now(),
      title,
      completed: false
    };
    dispatch(addSubtask({ taskId, subtask: newSt }));
    if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
      setSelectedTaskDetails((prev) => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), newSt]
      }));
    }
  };

  // Team member handlers
  const handleAddTeamMember = (newMember) => {
    dispatch(addTeamMember(newMember));
    showToast(`Invited ${newMember.name} to workspace!`);
  };

  const handleDeleteTeamMember = (memberId) => {
    if (currentUser && (memberId === currentUser.id || memberId === 'usr-me')) {
      showToast('Cannot remove workspace owner.');
      return;
    }
    dispatch(deleteTeamMember(memberId));
    showToast('Team member removed.');
  };

  // Notification handlers
  const handleNotificationClick = (notif) => {
    dispatch(markAsRead(notif.id));
    if (notif.type === 'assignment') {
      navigate('/tasks');
    } else if (notif.type === 'calendar') {
      navigate('/dashboard');
    } else if (notif.type === 'milestone') {
      navigate('/projects');
    }
  };

  // Determine current active view based on React Router location pathname
  const currentPath = location.pathname.replace(/^\//, '') || 'dashboard';

  return (
    <div className="app-container">
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--text-main)',
            color: 'var(--bg-app)',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Sidebar with React Router NavLinks */}
      <Sidebar />

      <div className="main-wrapper">
        {/* TopNav connected to AuthContext & ThemeContext */}
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View rendering based on URL route */}
        {currentPath === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            projects={projects}
            tasks={tasks}
            teamMembers={teamMembers}
            onNavigateToProjects={() => navigate('/projects')}
            onNavigateToTasks={(projId) => {
              if (projId) {
                const p = projects.find((proj) => proj.id === projId);
                if (p) setSelectedProject(p);
              }
              navigate('/tasks');
            }}
            onNavigateToKanban={() => navigate('/kanban')}
            onNavigateToTeam={() => navigate('/team')}
            onTaskClick={(task) => setSelectedTaskDetails(task)}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onOpenCreateTask={handleOpenCreateTask}
            onClearAllProjects={handleClearAllProjects}
            onLoadSampleData={handleLoadSampleData}
            onExportReport={() => navigate('/reports')}
          />
        )}

        {currentPath === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onSelectProject={(project) => {
              setSelectedProject(project);
              navigate('/tasks');
            }}
            onDeleteProject={handleDeleteProject}
            onClearAllProjects={handleClearAllProjects}
            onLoadSampleData={handleLoadSampleData}
            teamMembers={teamMembers}
            searchQuery={searchQuery}
          />
        )}

        {currentPath === 'kanban' && (
          <KanbanView
            tasks={tasks}
            projects={projects}
            teamMembers={teamMembers}
            currentUser={currentUser}
            onOpenCreateTask={handleOpenCreateTask}
            onTaskClick={(task) => setSelectedTaskDetails(task)}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            searchQuery={searchQuery}
            onSwitchToTableView={() => navigate('/tasks')}
          />
        )}

        {currentPath === 'tasks' && (
          <TasksView
            tasks={tasks}
            projects={projects}
            teamMembers={teamMembers}
            currentUser={currentUser}
            onOpenCreateTask={handleOpenCreateTask}
            onTaskClick={(task) => setSelectedTaskDetails(task)}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            searchQuery={searchQuery}
            onSwitchToKanbanView={() => navigate('/kanban')}
          />
        )}

        {currentPath === 'team' && (
          <TeamView
            teamMembers={teamMembers}
            currentUser={currentUser}
            tasks={tasks}
            projects={projects}
            onAddTeamMember={handleAddTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
            onOpenCreateTask={handleOpenCreateTask}
            onTaskClick={(task) => setSelectedTaskDetails(task)}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            showToast={showToast}
          />
        )}

        {currentPath === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAsRead={(id) => dispatch(markAsRead(id))}
            onMarkAllAsRead={() => dispatch(markAllAsRead())}
            onDeleteNotification={(id) => dispatch(deleteNotification(id))}
            onClearAllNotifications={() => dispatch(clearAllNotifications())}
            onResetNotifications={() => dispatch(resetNotifications())}
            onNotificationClick={handleNotificationClick}
            showToast={showToast}
          />
        )}

        {currentPath === 'reports' && (
          <ReportsView
            projects={projects}
            tasks={tasks}
            teamMembers={teamMembers}
            onExportReport={() => showToast('Report exported successfully!')}
          />
        )}

        {currentPath === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            setCurrentUser={updateUser}
            theme={theme}
            setTheme={setTheme}
            onLogout={logout}
            onClearAllProjects={handleClearAllProjects}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {/* Supports standard React Router Outlet for any sub-routes */}
        <Outlet />
      </div>

      {/* Global Modals for Form Handling */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onAddProject={handleAddProject}
        teamMembers={teamMembers}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setCreateTaskDefaultDueDate('');
        }}
        onAddTask={handleAddTask}
        projects={projects}
        teamMembers={teamMembers}
        defaultStatus={createTaskDefaultStatus}
        defaultDueDate={createTaskDefaultDueDate}
      />

      <TaskDetailsModal
        task={selectedTaskDetails}
        isOpen={!!selectedTaskDetails}
        onClose={() => setSelectedTaskDetails(null)}
        onUpdateTask={handleUpdateTask}
        onUpdateStatus={handleUpdateTaskStatus}
        onAddComment={handleAddComment}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
        onDeleteTask={handleDeleteTask}
        currentUser={currentUser}
        teamMembers={teamMembers}
      />
    </div>
  );
}

export default DashboardLayout;
