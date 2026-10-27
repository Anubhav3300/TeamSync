import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import projectsReducer from './projectsSlice';
import teamReducer from './teamSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    team: teamReducer,
    notifications: notificationsReducer
  }
});

// Sync state to localStorage on changes
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('teamsync_global_tasks', JSON.stringify(state.tasks.items));
    localStorage.setItem('teamsync_global_projects', JSON.stringify(state.projects.items));
    localStorage.setItem('teamsync_global_team', JSON.stringify(state.team.items));
  } catch (e) {
    console.error('Failed to persist Redux state to localStorage', e);
  }
});

export default store;
