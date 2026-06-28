/**
 * githubOAuth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised constants and utility functions for the GitHub OAuth 2.0 flow.
 *
 * Why this file exists:
 *   - All GitHub OAuth configuration lives in one place. If the redirect URI,
 *     scopes, or state-storage key ever change, only this file needs updating.
 *   - Components and hooks import named constants, never magic strings.
 *
 * Environment variables used:
 *   VITE_GITHUB_CLIENT_ID      — GitHub OAuth App client ID (safe to expose)
 *   VITE_GITHUB_REDIRECT_URI   — Full callback URL registered in the GitHub App
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── OAuth App Configuration ───────────────────────────────────────────────────

/** GitHub OAuth App client ID. Set in .env as VITE_GITHUB_CLIENT_ID. */
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? "";

/**
 * The frontend callback URL that GitHub will redirect to after authorisation.
 * This MUST match exactly what is registered in your GitHub OAuth App settings.
 * Set in .env as VITE_GITHUB_REDIRECT_URI.
 */
export const GITHUB_REDIRECT_URI =
  import.meta.env.VITE_GITHUB_REDIRECT_URI ??
  `${window.location.origin}/auth/github/callback`;

// ── Scopes ────────────────────────────────────────────────────────────────────

/**
 * Space-separated GitHub OAuth scopes requested during authorisation.
 * - "read:user"   — read user's public profile
 * - "user:email"  — access user's email addresses (needed for account linking)
 *
 * Expand this list only if the application genuinely needs additional access.
 */
export const GITHUB_SCOPES = "read:user user:email";

// ── CSRF State Storage ────────────────────────────────────────────────────────

/**
 * sessionStorage key used to store the CSRF state token.
 * sessionStorage is preferred over localStorage for CSRF tokens because it is
 * automatically cleared when the tab is closed — reducing the attack surface.
 */
export const GITHUB_STATE_KEY = "github_oauth_state";

// ── Routes ────────────────────────────────────────────────────────────────────

/** The internal frontend route for the GitHub OAuth callback page. */
export const GITHUB_CALLBACK_ROUTE = "/auth/github/callback";

/** The GitHub OAuth authorisation endpoint (never changes). */
const GITHUB_AUTH_BASE_URL = "https://github.com/login/oauth/authorize";

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random state token for CSRF protection.
 *
 * Uses the Web Crypto API (available in all modern browsers) to produce a
 * 32-byte random value, then encodes it as a URL-safe base64 string.
 *
 * @returns {string} A 43–44 character random token.
 */
export function generateOAuthState() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Builds the complete GitHub OAuth authorisation URL.
 *
 * The `state` parameter is included to prevent CSRF attacks. The caller is
 * responsible for saving the state to sessionStorage before redirecting so
 * the callback page can verify it.
 *
 * @param {string} state — The CSRF state token (from generateOAuthState).
 * @returns {string}       The full URL to redirect the user to.
 *
 * @example
 *   const state = generateOAuthState();
 *   sessionStorage.setItem(GITHUB_STATE_KEY, state);
 *   window.location.href = buildGithubOAuthUrl(state);
 */
export function buildGithubOAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: GITHUB_SCOPES,
    state,
  });
  return `${GITHUB_AUTH_BASE_URL}?${params.toString()}`;
}
