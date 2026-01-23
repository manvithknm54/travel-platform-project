import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const { login, loading, error } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow}></div>

      <form
        onSubmit={handleSubmit}
        style={{
          ...styles.card,
          transform: isHovered ? "translateY(-8px)" : "translateY(0px)",
          boxShadow: isHovered
            ? "0 30px 60px -12px rgba(0, 0, 0, 0.8)"
            : "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.headerGroup}>
          <h2 style={styles.title}>Safarify</h2>
          <p style={styles.subtitle}>Log in to continue your adventure</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={{
              ...styles.input,
              borderColor:
                activeField === "email"
                  ? "var(--primary)"
                  : "var(--border)",
              boxShadow:
                activeField === "email"
                  ? "0 0 0 4px rgba(22, 101, 52, 0.15)"
                  : "none",
            }}
            onFocus={() => setActiveField("email")}
            onBlur={() => setActiveField(null)}
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              style={{
                ...styles.input,
                borderColor:
                  activeField === "password"
                    ? "var(--primary)"
                    : "var(--border)",
                boxShadow:
                  activeField === "password"
                    ? "0 0 0 4px rgba(22, 101, 52, 0.15)"
                    : "none",
              }}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            filter: loading ? "grayscale(0.5)" : "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transform: loading ? "scale(0.98)" : "scale(1)",
          }}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Sign In to Safarify"}
        </button>

        <p style={styles.footer}>
          New to the wild?{" "}
          <Link to="/signup" style={styles.link}>
            Join the journey
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ================= THEME-AWARE DESIGN ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },

  bgGlow: {
    position: "absolute",
    width: "40vw",
    height: "40vw",
    background:
      "radial-gradient(circle, rgba(22, 101, 52, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
    top: "-10%",
    right: "-10%",
    zIndex: 0,
  },

  card: {
    zIndex: 1,
    width: "100%",
    maxWidth: "400px",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    borderRadius: "28px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
  },

  headerGroup: {
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-1px",
    margin: "0 0 10px 0",
    background: "linear-gradient(to bottom, var(--text-primary), var(--text-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    fontWeight: "400",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    paddingLeft: "4px",
  },

  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  eye: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
    opacity: 0.6,
    transition: "opacity 0.2s",
  },

  button: {
    marginTop: "10px",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    boxShadow: "0 10px 20px -10px rgba(22, 101, 52, 0.5)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  errorBox: {
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    padding: "14px",
    borderRadius: "12px",
    fontSize: "14px",
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginTop: "10px",
  },

  link: {
    color: "var(--primary)",
    textDecoration: "none",
    fontWeight: "700",
    transition: "all 0.2s ease",
  },
};

export default Login;
