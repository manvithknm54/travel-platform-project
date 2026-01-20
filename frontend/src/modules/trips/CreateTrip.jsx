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
    borderColor: isFocused === id ? "#6366F1" : "rgba(255,255,255,0.1)",
    boxShadow: isFocused === id ? "0 0 0 3px rgba(99, 102, 241, 0.2)" : "none",
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.cardTitle}>Plan New Adventure</h2>
          <p style={styles.subtitle}>Fill in the details below to start your journey.</p>
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
              style={{ ...getFieldStyle("desc"), minHeight: "110px", resize: "none" }}
              placeholder="What are you most excited about?"
              onFocus={() => setIsFocused("desc")}
              onBlur={() => setIsFocused("")}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.dateRow}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input style={styles.input} type="date" onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input style={styles.input} type="date" onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div style={styles.buttonWrapper}>
            <button type="button" onClick={() => navigate("/")} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating..." : "Confirm Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at top right, #1e1b4b 0%, #020617 100%)", fontFamily: "'Inter', sans-serif", padding: "20px" },
  card: { width: "100%", maxWidth: "520px", padding: "48px", borderRadius: "28px", background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" },
  header: { marginBottom: "32px" },
  cardTitle: { fontSize: "30px", fontWeight: "700", color: "#fff", margin: "0 0 8px 0" },
  subtitle: { fontSize: "15px", color: "#94a3b8", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: "24px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px" },
  input: { padding: "14px 16px", borderRadius: "14px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", fontSize: "15px", outline: "none", transition: "all 0.2s" },
  dateRow: { display: "flex", gap: "20px" },
  buttonWrapper: { display: "flex", gap: "12px", marginTop: "12px" },
  cancelBtn: { flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: "600" },
  button: { flex: 2, padding: "14px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "#fff", fontWeight: "600", cursor: "pointer", boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.4)" },
};

export default CreateTrip;