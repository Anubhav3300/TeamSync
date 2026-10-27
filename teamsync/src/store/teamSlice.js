import { createSlice } from '@reduxjs/toolkit';
import { initialTeamMembers } from '../data/mockData';

const loadSavedTeam = () => {
  try {
    const saved = localStorage.getItem('teamsync_global_team');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialTeamMembers;
};

const initialState = {
  items: loadSavedTeam()
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addTeamMember: (state, action) => {
      state.items.push(action.payload);
    },
    addMultipleMembers: (state, action) => {
      state.items.push(...action.payload);
    },
    deleteTeamMember: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    setTeamMembers: (state, action) => {
      state.items = action.payload;
    },
    resetTeam: (state) => {
      state.items = initialTeamMembers;
    },
    clearTeam: (state) => {
      state.items = [];
    }
  }
});

export const {
  addTeamMember,
  addMultipleMembers,
  deleteTeamMember,
  setTeamMembers,
  resetTeam,
  clearTeam
} = teamSlice.actions;

export const selectAllTeamMembers = (state) => state.team.items;

export default teamSlice.reducer;
