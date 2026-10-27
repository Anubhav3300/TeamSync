import { createSlice } from '@reduxjs/toolkit';
import { initialTasks } from '../data/mockData';

const loadSavedTasks = () => {
  try {
    const saved = localStorage.getItem('teamsync_global_tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialTasks;
};

const initialState = {
  items: loadSavedTasks(),
  selectedTaskId: null,
  statusFilter: 'ALL',
  priorityFilter: 'ALL'
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (task) {
        task.status = status;
        if (status === 'DONE') {
          task.completed = true;
          task.progress = 100;
        } else {
          task.completed = false;
        }
      }
    },
    toggleTaskComplete: (state, action) => {
      const taskId = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) {
        const nextDone = task.status !== 'DONE';
        task.status = nextDone ? 'DONE' : 'IN PROGRESS';
        task.completed = nextDone;
        task.progress = nextDone ? 100 : Math.min(task.progress || 50, 75);
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
    },
    deleteTasksByProject: (state, action) => {
      state.items = state.items.filter((t) => t.projectId !== action.payload);
    },
    addSubtask: (state, action) => {
      const { taskId, subtask } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) {
        if (!Array.isArray(task.subtasks)) task.subtasks = [];
        task.subtasks.push(subtask);
      }
    },
    toggleSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task && Array.isArray(task.subtasks)) {
        const st = task.subtasks.find((s) => s.id === subtaskId);
        if (st) {
          st.completed = !st.completed;
          const doneCount = task.subtasks.filter((s) => s.completed).length;
          task.progress = Math.round((doneCount / task.subtasks.length) * 100);
          if (task.progress === 100) {
            task.status = 'DONE';
            task.completed = true;
          }
        }
      }
    },
    addComment: (state, action) => {
      const { taskId, comment } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) {
        if (!Array.isArray(task.comments)) task.comments = [];
        task.comments.push(comment);
      }
    },
    setSelectedTaskId: (state, action) => {
      state.selectedTaskId = action.payload;
    },
    resetTasks: (state) => {
      state.items = initialTasks;
      state.selectedTaskId = null;
    },
    clearTasks: (state) => {
      state.items = [];
      state.selectedTaskId = null;
    }
  }
});

export const {
  addTask,
  updateTask,
  updateTaskStatus,
  toggleTaskComplete,
  deleteTask,
  deleteTasksByProject,
  addSubtask,
  toggleSubtask,
  addComment,
  setSelectedTaskId,
  resetTasks,
  clearTasks
} = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectSelectedTaskId = (state) => state.tasks.selectedTaskId;
export const selectSelectedTask = (state) =>
  state.tasks.items.find((t) => t.id === state.tasks.selectedTaskId) || null;
export const selectPendingTasksCount = (state) =>
  state.tasks.items.filter((t) => t.status !== 'DONE').length;
export const selectCompletedTasksCount = (state) =>
  state.tasks.items.filter((t) => t.status === 'DONE').length;

export default tasksSlice.reducer;
