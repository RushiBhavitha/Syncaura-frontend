import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.2 10.2z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2 1.5-4.6 2.6-7.6 2.6-5.2 0-9.6-3.3-11.2-8l-6.6 5C9.9 39.6 16.4 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C41.5 36.4 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
    />
  </svg>
);

// onSwitchToSignup: optional callback to navigate to the Signup page (e.g. via react-router)
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                fill="url(#grad1)"
                stroke="white"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="grad1" x1="3" y1="2" x2="21" y2="22">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.subtitle}>Login to your account and continue</p>

        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <Mail size={18} color="#9ca3af" />
              <input type="email" placeholder="Enter your email" style={styles.input} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={18} color="#9ca3af" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
              </button>
            </div>
          </div>

          <div style={styles.forgotWrap}>
            <a href="#" style={styles.link}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={styles.primaryBtn}>
            Login
          </button>

          <div style={styles.dividerWrap}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button type="button" style={styles.googleBtn}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <a
              href="#"
              style={styles.switchLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input:focus {
          outline: none;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }
        button:focus-visible {
          outline: 2px solid #7c3aed;
          outline-offset: 2px;
        }
        a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 50%, #ddd6fe 100%)",
    padding: "24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px 36px",
    boxShadow: "0 20px 50px rgba(109, 40, 217, 0.12)",
  },
  logoWrap: { marginBottom: "20px" },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: "26px", fontWeight: 800, color: "#111827", margin: "0 0 6px 0" },
  subtitle: { fontSize: "14.5px", color: "#6b7280", margin: "0 0 28px 0" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13.5px", fontWeight: 700, color: "#1f2937" },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "13px 14px",
    background: "#fafafa",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    fontSize: "14.5px",
    color: "#111827",
    minWidth: 0,
  },
  eyeBtn: { background: "none", border: "none", padding: 0, display: "flex", cursor: "pointer" },
  forgotWrap: { display: "flex", justifyContent: "flex-end", marginTop: "-6px" },
  link: { color: "#7c3aed", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" },
  primaryBtn: {
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    fontSize: "15.5px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(109, 40, 217, 0.25)",
  },
  dividerWrap: { display: "flex", alignItems: "center", gap: "12px", margin: "2px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#e5e7eb" },
  dividerText: { fontSize: "13px", color: "#9ca3af" },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "13px",
    background: "#fff",
    fontSize: "14.5px",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  switchText: { textAlign: "center", fontSize: "13.5px", color: "#6b7280", margin: "4px 0 0 0" },
  switchLink: { color: "#7c3aed", fontWeight: 700, textDecoration: "none" },
};