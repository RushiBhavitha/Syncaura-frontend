import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 1. Fetch all notices
export const fetchNotices = createAsyncThunk(
  "notice/fetchNotices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notices");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notices"
      );
    }
  }
);

// 2. Fetch single notice by ID
export const fetchNoticeById = createAsyncThunk(
  "notice/fetchNoticeById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/notices/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notice"
      );
    }
  }
);

// 3. Create a new notice (admin/co-admin only)
export const createNotice = createAsyncThunk(
  "notice/createNotice",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/notices", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create notice"
      );
    }
  }
);

// 4. Update a notice (admin/co-admin only)
export const updateNotice = createAsyncThunk(
  "notice/updateNotice",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/notices/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update notice"
      );
    }
  }
);

// 5. Delete a notice (admin/co-admin only)
export const deleteNotice = createAsyncThunk(
  "notice/deleteNotice",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notices/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notice"
      );
    }
  }
);