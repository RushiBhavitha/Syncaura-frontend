/**
 * GitHubCallback.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * GitHub OAuth 2.0 callback handler page.
 * Route: /auth/github/callback
 *
 * This page is the destination GitHub redirects to after a user authorises
 * (or cancels) the OAuth flow. It is responsible for:
 *
 *  1. Parsing `code`, `state`, and `error` from the URL query parameters.
 *  2. Validating the CSRF state token against the value stored in sessionStorage.
 *  3. Dispatching the `githubOAuthLogin` thunk to exchange the code for tokens.
 *  4. Rendering appropriate Loading / Success / Error UI.
 *  5. Redirecting to the user's role-based dashboard on success.
 *  6. Cleaning URL parameters after processing to prevent token leakage.
 *
 * Security notes:
 *  - Duplicate processing is prevented with a useRef flag.
 *  - Tokens are never logged, even in development mode.
 *  - URL search params are cleared with replaceState after processing.
 *  - sessionStorage state key is removed after it has been verified.
 *
 * Integration:
 *  - Uses existing Redux authSlice (githubOAuthLogin thunk).
 *  - Uses existing react-toastify (already configured in App.jsx).
 *  - Matches existing dark/light theme via state.theme.isDark.
 *  - Uses framer-motion for animations (consistent with SignIn/SignUp).
 *  - Uses lucide-react icons (consistent with rest of the application).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  WifiOff,
  ServerCrash,
  Ban,
  RefreshCw,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

import { githubOAuthLogin } from "../redux/features/authThunks";
import { GITHUB_STATE_KEY } from "../constant/githubOAuth";

// ── Error type definitions ────────────────────────────────────────────────────

const ERROR_TYPES = {
  CANCELLED:     "cancelled",
  MISSING_CODE:  "missing_code",
  STATE_MISMATCH: "state_mismatch",
  NETWORK:       "network",
  BACKEND:       "backend",
  UNKNOWN:       "unknown",
};

// ── Error metadata map ────────────────────────────────────────────────────────

const ERROR_META = {
  [ERROR_TYPES.CANCELLED]: {
    Icon: Ban,
    title: "Authorization Cancelled",
    description:
      "You cancelled the GitHub authorization. No changes were made to your account.",
    colour: "text-amber-500",
    bgColour: "bg-amber-500/10",
    borderColour: "border-amber-500/30",
    showRetry: true,
  },
  [ERROR_TYPES.MISSING_CODE]: {
    Icon: AlertTriangle,
    title: "Invalid Callback",
    description:
      "This page was opened directly or the authorization code is missing. " +
      "Please start the GitHub login process from the sign-in page.",
    colour: "text-amber-500",
    bgColour: "bg-amber-500/10",
    borderColour: "border-amber-500/30",
    showRetry: false,
  },
  [ERROR_TYPES.STATE_MISMATCH]: {
    Icon: AlertTriangle,
    title: "Security Check Failed",
    description:
      "The request state does not match. This could indicate a CSRF attack or " +
      "your session expired. Please start the GitHub login process again.",
    colour: "text-red-500",
    bgColour: "bg-red-500/10",
    borderColour: "border-red-500/30",
    showRetry: true,
  },
  [ERROR_TYPES.NETWORK]: {
    Icon: WifiOff,
    title: "Connection Error",
    description:
      "Unable to reach the server. Please check your internet connection and try again.",
    colour: "text-blue-500",
    bgColour: "bg-blue-500/10",
    borderColour: "border-blue-500/30",
    showRetry: true,
  },
  [ERROR_TYPES.BACKEND]: {
    Icon: ServerCrash,
    title: "Server Error",
    description:
      "The server encountered an error while processing your login. " +
      "Please try again in a few moments.",
    colour: "text-red-500",
    bgColour: "bg-red-500/10",
    borderColour: "border-red-500/30",
    showRetry: true,
  },
  [ERROR_TYPES.UNKNOWN]: {
    Icon: XCircle,
    title: "Authentication Failed",
    description:
      "An unexpected error occurred during GitHub authentication. Please try again.",
    colour: "text-red-500",
    bgColour: "bg-red-500/10",
    borderColour: "border-red-500/30",
    showRetry: true,
  },
};

// ── Loading step labels (shown sequentially during processing) ────────────────

const LOADING_STEPS = [
  "Checking authorization...",
  "Verifying security token...",
  "Completing GitHub login...",
  "Securing your account...",
  "Please wait...",
];

// ── Helper: determine role-based redirect destination ─────────────────────────

function getRoleDashboard(role) {
  switch (role) {
    case "Admin":    return "/admin";
    case "Co-Admin": return "/co-admin";
    default:         return "/user-dashboard";
  }
}

// ── Helper: classify error message into an error type ─────────────────────────

function classifyError(message) {
  if (!message) return ERROR_TYPES.UNKNOWN;
  const msg = message.toLowerCase();
  if (msg.includes("connection") || msg.includes("network") || msg.includes("reach"))
    return ERROR_TYPES.NETWORK;
  if (msg.includes("server") || msg.includes("500"))
    return ERROR_TYPES.BACKEND;
  return ERROR_TYPES.UNKNOWN;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GitHubCallback Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function GitHubCallback() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const [searchParams] = useSearchParams();

  const isDark     = useSelector((state) => state.theme.isDark);

  // ── Component state ─────────────────────────────────────────────────────────
  const [phase, setPhase]             = useState("loading"); // "loading" | "success" | "error"
  const [errorType, setErrorType]     = useState(ERROR_TYPES.UNKNOWN);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  // ── Duplicate-processing guard ───────────────────────────────────────────────
  // Prevents the effect from running twice (React StrictMode double-invoke,
  // or manual re-renders) by tracking whether processing has started.
  const hasProcessed = useRef(false);

  // ── Animate loading step text ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "loading") return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 900);

    return () => clearInterval(interval);
  }, [phase]);

  // ── Main OAuth processing effect ─────────────────────────────────────────────
  useEffect(() => {
    // Guard: run only once per mount.
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const process = async () => {
      // 1. Read URL parameters from the GitHub redirect.
      const code       = searchParams.get("code");
      const state      = searchParams.get("state");
      const errorParam = searchParams.get("error");

      // 2. Clean URL parameters immediately to prevent tokens leaking via
      //    browser history or referrer headers.
      window.history.replaceState(null, "", window.location.pathname);

      // 3. Handle explicit error from GitHub (e.g. user clicked "Cancel").
      if (errorParam) {
        if (import.meta.env.DEV) {
          console.warn("[GitHubCallback] GitHub returned an error:", errorParam);
        }
        setErrorType(ERROR_TYPES.CANCELLED);
        setErrorMessage(
          errorParam === "access_denied"
            ? "You cancelled the GitHub authorization."
            : `GitHub returned: ${errorParam}`
        );
        setPhase("error");
        return;
      }

      // 4. Validate that the authorization code is present.
      if (!code) {
        setErrorType(ERROR_TYPES.MISSING_CODE);
        setErrorMessage("No authorization code was received from GitHub.");
        setPhase("error");
        return;
      }

      // 5. Validate the CSRF state token.
      const savedState = sessionStorage.getItem(GITHUB_STATE_KEY);
      sessionStorage.removeItem(GITHUB_STATE_KEY); // always clean up

      if (!savedState || savedState !== state) {
        setErrorType(ERROR_TYPES.STATE_MISMATCH);
        setErrorMessage("Security state token mismatch.");
        setPhase("error");

        if (import.meta.env.DEV) {
          console.error(
            "[GitHubCallback] State mismatch.",
            { received: state, saved: savedState }
          );
        }
        return;
      }

      // 6. Exchange the authorization code for session tokens via Redux thunk.
      try {
        const result = await dispatch(githubOAuthLogin({ code, state })).unwrap();

        // Success path
        setPhase("success");
        toast.success(
          `Welcome${result.user?.name ? `, ${result.user.name}` : ""}! GitHub connected successfully.`,
          { toastId: "github-login-success" }
        );

        // Redirect to the user's role-based dashboard after a short delay
        // so the user can see the success screen.
        setTimeout(() => {
          navigate(getRoleDashboard(result.user?.role), { replace: true });
        }, 2000);

      } catch (err) {
        // err is the rejectWithValue payload (a string) from githubOAuthLogin.
        const message = typeof err === "string" ? err : "GitHub login failed.";

        setErrorType(classifyError(message));
        setErrorMessage(message);
        setPhase("error");

        toast.error(message, { toastId: "github-login-error" });

        if (import.meta.env.DEV) {
          console.error("[GitHubCallback] OAuth login failed:", message);
        }
      }
    };

    process();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: searchParams and dispatch are stable across renders;
  // the empty dep array is intentional — this effect must run exactly once.

  // ─────────────────────────────────────────────────────────────────────────────
  // Theme-aware style tokens (mirrors the pattern used in SignIn/SignUp)
  // ─────────────────────────────────────────────────────────────────────────────

  const cardBg        = isDark ? "bg-[#0F172A]"  : "bg-white";
  const pageBg        = isDark ? "bg-[#020617]"  : "bg-slate-100";
  const textPrimary   = isDark ? "text-white"     : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const borderColour  = isDark ? "border-slate-700" : "border-gray-200";

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-components (defined inline to keep this file self-contained)
  // ─────────────────────────────────────────────────────────────────────────────

  // GitHub logo SVG (inline so no external asset dependency)
  const GitHubIcon = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );

  // ─── Loading UI ──────────────────────────────────────────────────────────────

  const LoadingView = () => (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        w-full max-w-sm mx-auto rounded-2xl border shadow-2xl p-10
        flex flex-col items-center gap-6
        ${cardBg} ${borderColour}
      `}
      role="status"
      aria-live="polite"
      aria-label="GitHub login in progress"
    >
      {/* GitHub icon with pulse ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full bg-slate-700/30"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 80, height: 80 }}
          aria-hidden="true"
        />
        <motion.div
          className={`relative z-10 rounded-full p-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <GitHubIcon className={`w-10 h-10 ${isDark ? "text-slate-200" : "text-slate-800"}`} />
        </motion.div>
      </div>

      {/* Spinner */}
      <Loader2
        className="w-6 h-6 text-blue-500 animate-spin"
        aria-hidden="true"
      />

      {/* Animated step text */}
      <div className="text-center space-y-1">
        <h1 className={`text-lg font-semibold ${textPrimary}`}>
          Connecting with GitHub
        </h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingStep}
            className={`text-sm ${textSecondary}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            {LOADING_STEPS[loadingStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div
        className={`w-full rounded-full h-1 overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
        aria-hidden="true"
      >
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );

  // ─── Success UI ──────────────────────────────────────────────────────────────

  const SuccessView = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        w-full max-w-sm mx-auto rounded-2xl border shadow-2xl p-10
        flex flex-col items-center gap-6
        ${cardBg} ${borderColour}
      `}
      role="status"
      aria-live="polite"
      aria-label="GitHub login successful"
    >
      {/* Success icon with animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" aria-hidden="true" />
        <div className="relative rounded-full bg-emerald-500/10 p-5 border border-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-emerald-500" aria-hidden="true" />
        </div>
      </motion.div>

      <div className="text-center space-y-2">
        <motion.h1
          className={`text-xl font-bold ${textPrimary}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          GitHub Connected!
        </motion.h1>

        <motion.p
          className={`text-sm ${textSecondary}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Account verified successfully. Redirecting you to your dashboard…
        </motion.p>
      </div>

      {/* Animated redirect indicator */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" aria-hidden="true" />
        <span className={`text-xs ${textSecondary}`}>Redirecting…</span>
      </motion.div>
    </motion.div>
  );

  // ─── Error UI ────────────────────────────────────────────────────────────────

  const ErrorView = () => {
    const meta    = ERROR_META[errorType] ?? ERROR_META[ERROR_TYPES.UNKNOWN];
    const { Icon, title, description, colour, bgColour, borderColour: errBorder, showRetry } = meta;

    const handleRetry = () => {
      navigate("/sign-in", { replace: true });
    };

    const handleDashboard = () => {
      navigate("/user-dashboard", { replace: true });
    };

    return (
      <motion.div
        key="error"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          w-full max-w-sm mx-auto rounded-2xl border shadow-2xl p-10
          flex flex-col items-center gap-6
          ${cardBg} ${borderColour}
        `}
        role="alert"
        aria-live="assertive"
        aria-label={`Authentication error: ${title}`}
      >
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        >
          <div className={`rounded-full p-5 border ${bgColour} ${errBorder}`}>
            <Icon className={`w-12 h-12 ${colour}`} aria-hidden="true" />
          </div>
        </motion.div>

        {/* Error text */}
        <div className="text-center space-y-2">
          <motion.h1
            className={`text-xl font-bold ${textPrimary}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className={`text-sm leading-relaxed ${textSecondary}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {errorMessage || description}
          </motion.p>
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col w-full gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {showRetry && (
            <button
              id="github-retry-btn"
              onClick={handleRetry}
              className="
                flex items-center justify-center gap-2 w-full py-2.5 px-4
                rounded-lg text-sm font-semibold
                bg-blue-600 hover:bg-blue-700 active:scale-95
                text-white transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              aria-label="Retry GitHub login"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          )}

          <button
            id="github-back-to-login-btn"
            onClick={handleRetry}
            className={`
              flex items-center justify-center gap-2 w-full py-2.5 px-4
              rounded-lg text-sm font-semibold border transition-all duration-150
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              ${isDark
                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }
            `}
            aria-label="Return to sign in page"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Back to Sign In
          </button>

          <button
            id="github-go-dashboard-btn"
            onClick={handleDashboard}
            className={`
              flex items-center justify-center gap-2 w-full py-2 px-4
              rounded-lg text-xs transition-all duration-150 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              ${textSecondary} hover:underline
            `}
            aria-label="Go to dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            Go to Dashboard
          </button>
        </motion.div>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`
        min-h-screen w-full flex flex-col items-center justify-center
        px-4 py-12 transition-colors duration-300
        ${pageBg}
      `}
    >
      {/* Subtle background decoration (matches Home/SignUp aesthetic) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={`
            absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20
            ${isDark ? "bg-blue-600" : "bg-blue-400"}
          `}
        />
        <div
          className={`
            absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20
            ${isDark ? "bg-slate-600" : "bg-slate-300"}
          `}
        />
      </div>

      {/* Branding */}
      <motion.p
        className={`relative z-10 text-xs font-medium tracking-widest uppercase mb-8 ${textSecondary}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Syncaura · GitHub Authentication
      </motion.p>

      {/* Card container */}
      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {phase === "loading" && <LoadingView />}
          {phase === "success" && <SuccessView />}
          {phase === "error"   && <ErrorView />}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.p
        className={`relative z-10 text-xs mt-8 ${textSecondary}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        Secured by GitHub OAuth 2.0
      </motion.p>
    </div>
  );
}
