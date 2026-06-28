import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  changePassword,
  refreshAccessToken,
  githubOAuthLogin,
} from "../features/authThunks";

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token,
  isLoading: false,
  error: null,
  isAuthenticated: !!token,
  authChecking: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (token) {
        localStorage.setItem("token", token);
      }
    },
    logout(state) {
      state.isLoading=true
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.isLoading=false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.accessToken;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.authChecking = true;
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, accessToken } = action.payload;
        state.user = user;
        state.token = accessToken;
        state.isAuthenticated = true;
        state.authChecking=false
        localStorage.setItem("accessToken", accessToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.authChecking = false;
        state.isLoading=false
        state.isAuthenticated=false
        state.user=null
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        // Password changed successfully — no state update required.
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── GitHub OAuth Login ─────────────────────────────────────────────────
      // Follows the exact same pattern as loginUser so the rest of the
      // application (ProtectRoute, role-based redirects, etc.) works without
      // any additional changes.
      .addCase(githubOAuthLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(githubOAuthLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        // Persist tokens identically to the email/password login flow.
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })
      .addCase(githubOAuthLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
