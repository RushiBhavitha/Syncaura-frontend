import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 1. Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// 2. Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications/unread/count");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

// 3. Mark one notification as read
export const markNotificationRead = createAsyncThunk(
  "notification/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

// 4. Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch("/notifications/mark-all-read");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all notifications as read"
      );
    }
  }
);

// 5. Delete one notification
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/notifications/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

// 6. Clear all notifications
export const clearAllNotifications = createAsyncThunk(
  "notification/clearAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/notifications");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear all notifications"
      );
    }
  }
);