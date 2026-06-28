import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { exchangeGithubCode } from "../../services/githubAuthService";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to register user",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to login",
      );
    }
  },
);


export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await api.post("/auth/refresh", { refreshToken });

      return res.data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await api.put("/auth/change-password", passwordData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password",
      );
    }
  },
);

/**
 * githubOAuthLogin
 * ─────────────────────────────────────────────────────────────────────────────
 * Exchanges a GitHub authorization code for session tokens by calling the
 * backend endpoint via githubAuthService.
 *
 * This thunk is dispatched by GitHubCallback.jsx after GitHub redirects the
 * user back to /auth/github/callback with a `code` query parameter.
 *
 * On success:
 *   - The returned { user, tokens } are stored in Redux state (authSlice).
 *   - accessToken and refreshToken are persisted to localStorage so subsequent
 *     page loads can restore the session via the refreshAccessToken thunk.
 *
 * On failure:
 *   - A structured error string is passed to rejectWithValue so the callback
 *     page can display a contextual error message to the user.
 *
 * @param {{ code: string, state: string }} payload
 *   - code:  GitHub's one-time authorization code (from URL query param).
 *   - state: The CSRF state token (verified by the caller before dispatching).
 *
 * @returns {{ user: object, tokens: { accessToken: string, refreshToken: string } }}
 */
export const githubOAuthLogin = createAsyncThunk(
  "auth/githubOAuthLogin",
  async ({ code, state }, { rejectWithValue }) => {
    try {
      const data = await exchangeGithubCode({ code, state });
      return data;
    } catch (err) {
      // Distinguish network errors (no response) from API errors (4xx/5xx).
      if (!err.response) {
        return rejectWithValue(
          "Unable to reach the server. Please check your connection and try again."
        );
      }

      const status = err.response.status;

      if (status === 400) {
        return rejectWithValue(
          err.response.data?.message || "The authorization code is invalid or has expired."
        );
      }

      if (status === 401) {
        return rejectWithValue(
          err.response.data?.message || "GitHub authorization was denied."
        );
      }

      if (status >= 500) {
        return rejectWithValue(
          "The server encountered an error. Please try again later."
        );
      }

      return rejectWithValue(
        err.response.data?.message || "GitHub login failed. Please try again."
      );
    }
  }
);