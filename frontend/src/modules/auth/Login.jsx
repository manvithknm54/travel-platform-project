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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form); // ✅ OLD FLOW → DIRECT DASHBOARD
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password field with eye INSIDE */}
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            style={styles.eyeLogin}
            onClick={() => setShowPassword(!showPassword)}
            title="Show / hide password"
          >
            👁
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footer}>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "360px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeLogin: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none",
    color: "#007bff", // 🔵 login color
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
  },
};

export default Login;
