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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form); // ✅ OLD FLOW → DIRECT DASHBOARD
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
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
            style={styles.eyeSignup}
            onClick={() => setShowPassword(!showPassword)}
            title="Show / hide password"
          >
            👁
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
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
  eyeSignup: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none",
    color: "#28a745", // 🟢 signup color
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

export default Signup;
