import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function CreateTrip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState("");
  const [isCancelHovered, setIsCancelHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    setLoading(true);
    try {
      await apiClient.post("/trips", { title, description, startDate, endDate });
      const tripEnd = new Date(endDate);
      if (tripEnd >= new Date()) {
        sessionStorage.setItem("trip_created", "true");
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const getFieldStyle = (id) => ({
    ...styles.input,
    borderColor:
      isFocused === id ? "var(--primary)" : "var(--border)",
    boxShadow:
      isFocused === id
        ? "0 0 0 4px rgba(22, 101, 52, 0.15)"
        : "none",
    transform: isFocused === id ? "translateY(-1px)" : "translateY(0px)",
  });

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.cardTitle}>Plan New Adventure</h2>
          <p style={styles.subtitle}>
            Fill in the details below to start your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Trip Title</label>
            <input
              style={getFieldStyle("title")}
              type="text"
              placeholder="e.g. Summer in Santorini"
              onFocus={() => setIsFocused("title")}
              onBlur={() => setIsFocused("")}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              style={{
                ...getFieldStyle("desc"),
                minHeight: "100px",
                resize: "none",
              }}
              placeholder="What are you most excited about?"
              onFocus={() => setIsFocused("desc")}
              onBlur={() => setIsFocused("")}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.dateRow}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input
                style={getFieldStyle("start")}
                type="date"
                onFocus={() => setIsFocused("start")}
                onBlur={() => setIsFocused("")}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input
                style={getFieldStyle("end")}
                type="date"
                onFocus={() => setIsFocused("end")}
                onBlur={() => setIsFocused("")}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.buttonWrapper}>
            <button
              type="button"
              onClick={() => navigate("/")}
              onMouseEnter={() => setIsCancelHovered(true)}
              onMouseLeave={() => setIsCancelHovered(false)}
              style={{
                ...styles.cancelBtn,
                background: isCancelHovered
                  ? "rgba(0, 0, 0, 0.05)"
                  : "transparent",
                color: isCancelHovered
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating..." : "Confirm Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= THEME-AWARE CREATE TRIP STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },

  bgGlow: {
    position: "absolute",
    width: "60vw",
    height: "60vw",
    background:
      "radial-gradient(circle, rgba(22, 101, 52, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
    top: "-20%",
    right: "-10%",
    zIndex: 0,
  },

  card: {
    zIndex: 1,
    width: "100%",
    maxWidth: "520px",
    padding: "48px",
    borderRadius: "28px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
    backdropFilter: "blur(20px)",
  },

  header: { marginBottom: "32px" },

  cardTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: "0 0 10px 0",
    letterSpacing: "-1px",
  },

  subtitle: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    margin: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    paddingLeft: "4px",
  },

  input: {
    padding: "16px",
    borderRadius: "14px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
  },

  dateRow: {
    display: "flex",
    gap: "20px",
  },

  buttonWrapper: {
    display: "flex",
    gap: "16px",
    marginTop: "12px",
  },

  cancelBtn: {
    flex: 1,
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.2s ease",
    background: "transparent",
  },

  button: {
    flex: 2,
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(22, 101, 52, 0.4)",
    transition: "all 0.3s ease",
  },
};

export default CreateTrip;
