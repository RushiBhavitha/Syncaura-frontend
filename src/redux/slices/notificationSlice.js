import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../features/notificationThunks";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark one as read
      .addCase(markNotificationRead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((n) =>
          n._id === action.meta.arg ? { ...n, isRead: true } : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark all as read
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete one notification
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.meta.arg
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear all notifications
      .addCase(clearAllNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;