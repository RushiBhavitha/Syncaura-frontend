/**
 * githubAuthService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * API service module for GitHub OAuth authentication.
 *
 * Why this file exists:
 *   - Decouples the backend endpoint path from any component or thunk.
 *     If the backend changes the endpoint (e.g. from /auth/github/callback to
 *     /oauth/github), only this file needs updating.
 *   - Provides a typed, well-documented API surface for thunks to consume.
 *
 * Integration with backend:
 *   The backend receives the authorization code and state, exchanges the code
 *   with GitHub for an access token, then returns the authenticated user and
 *   session tokens. See "Expected backend contract" below.
 *
 * ── Expected request ──────────────────────────────────────────────────────────
 *   POST /api/auth/github/callback
 *   Content-Type: application/json
 *   {
 *     "code":  "<authorization_code_from_github>",
 *     "state": "<csrf_state_token>"
 *   }
 *
 * ── Expected response (success) ───────────────────────────────────────────────
 *   HTTP 200 OK
 *   {
 *     "user": {
 *       "id":     "...",
 *       "name":   "...",
 *       "email":  "...",
 *       "role":   "user",       // "user" | "admin" | "co-admin"
 *       "avatar": "https://..."
 *     },
 *     "tokens": {
 *       "accessToken":  "...",
 *       "refreshToken": "..."
 *     }
 *   }
 *
 * ── Expected response (error) ─────────────────────────────────────────────────
 *   HTTP 4xx / 5xx
 *   { "message": "Human-readable error description" }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import api from "../config/axios";

/**
 * The backend endpoint that handles the GitHub OAuth code exchange.
 *
 * Change this constant if the backend uses a different path.
 * The `api` instance already has the base URL + /api prefix configured,
 * so this is a relative path only.
 */
const GITHUB_CALLBACK_ENDPOINT = "/auth/github/callback";

/**
 * Exchanges a GitHub authorization code for session tokens.
 *
 * This is called by the `githubOAuthLogin` Redux thunk immediately after
 * the user is redirected back from GitHub with a `code` query parameter.
 *
 * @param {{ code: string, state: string }} payload
 *   - code:  The one-time authorization code GitHub included in the callback URL.
 *   - state: The CSRF state token that was generated before the redirect.
 *            The backend should verify this against the value it stored.
 *
 * @returns {Promise<{ user: object, tokens: { accessToken: string, refreshToken: string } }>}
 *
 * @throws {AxiosError} Re-throws Axios errors so the calling thunk can handle
 *                      them via `rejectWithValue`.
 */
export async function exchangeGithubCode({ code, state }) {
  const response = await api.post(GITHUB_CALLBACK_ENDPOINT, { code, state });
  return response.data;
}
