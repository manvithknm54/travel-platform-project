import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Signup() {
  const { signup, loading, error } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
  };

  return (
    <div style={styles.page}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          ...styles.card,
          transform: isHovered ? "translateY(-5px)" : "translateY(0px)",
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)" 
            : "0 20px 40px rgba(0,0,0,0.6)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.headerGroup}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our community and start your journey</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
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
              style={styles.input}
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
              {showPassword ? "🔒" : "👁️"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            filter: loading ? "grayscale(0.5)" : "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Get Started"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ================= PREMIUM DARK THEME STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    borderRadius: "24px",
    background: "rgba(30, 41, 59, 0.5)", 
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(16px)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  headerGroup: {
    textAlign: "center",
    marginBottom: "4px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.5px",
    margin: "0 0 8px 0",
  },

  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.5",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#cbd5e1",
    marginLeft: "4px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "15px",
    transition: "all 0.2s ease",
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
    opacity: 0.5,
    transition: "opacity 0.2s",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Green for signup
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
    transition: "all 0.3s ease",
  },

  errorBox: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    fontSize: "14px",
    color: "#94a3b8",
    marginTop: "4px",
  },

  link: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
};

export default Signup;