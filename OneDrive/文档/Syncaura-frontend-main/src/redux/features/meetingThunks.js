import  api  from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createMeeting = createAsyncThunk(
  "meeting/createMeeting",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/meetings/",data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to create meeting",
      );
    }
  },
);

export const getMeetings = createAsyncThunk(
  "meeting/getMeetings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/meetings/");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to fetch all meetings",
      );
    }
  },
);

export const getMeetingById = createAsyncThunk(
  "meeting/getMeetingById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/meetings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to fetch meeting by id",
      );
    }
  },
);


export const updateMeetingById = createAsyncThunk(
  "meeting/updateMeetingById",
  async ({id, data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/meetings/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to update meeting by id",
      );
    }
  },
);


export const deleteMeetingById = createAsyncThunk(
  "meeting/deleteMeetingById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/meetings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to delete meeting by id",
      );
    }
  },
);

