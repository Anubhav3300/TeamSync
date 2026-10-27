import { createSlice } from '@reduxjs/toolkit';
import { initialProjects } from '../data/mockData';

const loadSavedProjects = () => {
  try {
    const saved = localStorage.getItem('teamsync_global_projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialProjects;
};

const initialState = {
  items: loadSavedProjects(),
  selectedProjectId: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProject: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.selectedProjectId === action.payload) {
        state.selectedProjectId = null;
      }
    },
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    resetProjects: (state) => {
      state.items = initialProjects;
      state.selectedProjectId = null;
    },
    clearProjects: (state) => {
      state.items = [];
      state.selectedProjectId = null;
    }
  }
});

export const {
  addProject,
  updateProject,
  deleteProject,
  setSelectedProjectId,
  resetProjects,
  clearProjects
} = projectsSlice.actions;

// Selectors
export const selectAllProjects = (state) => state.projects.items;
export const selectSelectedProjectId = (state) => state.projects.selectedProjectId;
export const selectSelectedProject = (state) =>
  state.projects.items.find((p) => p.id === state.projects.selectedProjectId) || null;

export default projectsSlice.reducer;
