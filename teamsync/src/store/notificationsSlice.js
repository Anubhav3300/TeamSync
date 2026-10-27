import { createSlice } from '@reduxjs/toolkit';
import { initialNotifications } from '../data/mockData';

const initialState = {
  items: initialNotifications
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = !notif.read;
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    deleteNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
    resetNotifications: (state) => {
      state.items = initialNotifications;
    }
  }
});

export const {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  resetNotifications
} = notificationsSlice.actions;

export const selectAllNotifications = (state) => state.notifications.items;
export const selectUnreadNotificationsCount = (state) =>
  state.notifications.items.filter((n) => !n.read).length;

export default notificationsSlice.reducer;
