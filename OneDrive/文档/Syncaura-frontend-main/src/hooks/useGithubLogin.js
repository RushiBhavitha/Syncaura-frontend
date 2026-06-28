/**
 * useGithubLogin.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom React hook that initiates the GitHub OAuth 2.0 authorization flow.
 *
 * Responsibilities:
 *   1. Generate a cryptographically secure CSRF state token.
 *   2. Persist the state in sessionStorage so the callback page can verify it.
 *   3. Build the GitHub authorization URL using the project's constant module.
 *   4. Redirect the browser to GitHub's authorization endpoint.
 *
 * Usage:
 *   const { initiateGithubLogin, isLoading } = useGithubLogin();
 *   <button onClick={initiateGithubLogin}>Sign in with GitHub</button>
 *
 * Security:
 *   - The state token is stored in sessionStorage (not localStorage) so it is
 *     automatically cleared when the browser tab is closed.
 *   - The token is generated via the Web Crypto API, making it non-guessable.
 *   - Guards against mis-configuration: if VITE_GITHUB_CLIENT_ID is not set,
 *     it shows a toast error rather than redirecting to a broken URL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { toast } from "react-toastify";
import {
  buildGithubOAuthUrl,
  generateOAuthState,
  GITHUB_CLIENT_ID,
  GITHUB_STATE_KEY,
} from "../constant/githubOAuth";

/**
 * @returns {{ initiateGithubLogin: () => void, isLoading: boolean }}
 */
export function useGithubLogin() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Kicks off the GitHub OAuth flow:
   *   1. Validates environment configuration.
   *   2. Generates + stores a CSRF state token.
   *   3. Redirects the user to GitHub's authorisation page.
   *
   * The actual code exchange is handled by GitHubCallback.jsx once GitHub
   * redirects back to /auth/github/callback.
   */
  const initiateGithubLogin = () => {
    // Guard: ensure the OAuth app client ID is configured.
    if (!GITHUB_CLIENT_ID) {
      toast.error(
        "GitHub login is not configured. Please contact support.",
        { toastId: "github-config-error" } // prevent duplicate toasts
      );

      if (import.meta.env.DEV) {
        console.error(
          "[useGithubLogin] VITE_GITHUB_CLIENT_ID is not set in your .env file."
        );
      }
      return;
    }

    setIsLoading(true);

    try {
      // Generate a new CSRF state token for this specific login attempt.
      const state = generateOAuthState();

      // Persist the state so the callback page can verify it against the
      // state parameter GitHub echoes back in the redirect URL.
      sessionStorage.setItem(GITHUB_STATE_KEY, state);

      // Build the full GitHub authorization URL and redirect.
      const authUrl = buildGithubOAuthUrl(state);

      // Use window.location.href for a full-page redirect (not react-router
      // navigate) because this leaves the SPA entirely to visit GitHub.
      window.location.href = authUrl;

      // Note: setIsLoading(false) is intentionally omitted here because the
      // page is navigating away. The loading state will reset when GitHub
      // redirects back and the component re-mounts.
    } catch (err) {
      setIsLoading(false);

      toast.error("Failed to initiate GitHub login. Please try again.");

      if (import.meta.env.DEV) {
        console.error("[useGithubLogin] Error initiating GitHub OAuth:", err);
      }
    }
  };

  return { initiateGithubLogin, isLoading };
}

export default useGithubLogin;
