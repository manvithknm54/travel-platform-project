import { useState } from "react";
import apiClient from "../../services/apiClient";

function ShareTrip({ tripId }) {
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post(`/shares/trip/${tripId}`);
      setShareUrl(res.data.shareUrl);
    } catch (err) {
      console.error("Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.icon}>🌎</div>
        <h3 style={styles.title}>Invite Companions</h3>
        <p style={styles.subtitle}>
          Generate a private link to share your curated itinerary.
        </p>
      </header>

      {!shareUrl ? (
        <button
          style={loading ? styles.btnLoading : styles.generateBtn}
          onClick={generateLink}
          disabled={loading}
        >
          {loading ? "Creating Invitation..." : "Generate Expedition Link"}
        </button>
      ) : (
        <div style={styles.shareArea}>
          <div style={styles.inputContainer}>
            <input
              style={styles.linkInput}
              type="text"
              value={shareUrl}
              readOnly
            />
            <button style={styles.copyBtn} onClick={copyToClipboard}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <p style={styles.hint}>
            Anyone with this link can view your safari itinerary.
          </p>
        </div>
      )}

      {copied && (
        <div style={styles.toast}>
          <span style={{ marginRight: "8px" }}>🌿</span> Link ready to send!
        </div>
      )}
    </div>
  );
}

/* ================= THEME-AWARE SHARE STYLES ================= */

const styles = {
  container: {
    background: "var(--surface)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    textAlign: "center",
    maxWidth: "480px",
    margin: "0 auto",
  },

  header: { marginBottom: "28px" },

  icon: { fontSize: "32px", marginBottom: "16px" },

  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
  },

  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
  },

  generateBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  },

  btnLoading: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "var(--border)",
    color: "var(--text-secondary)",
    fontWeight: "700",
    cursor: "not-allowed",
  },

  shareArea: {
    animation: "fadeIn 0.4s ease forwards",
  },

  inputContainer: {
    display: "flex",
    background: "var(--bg)",
    borderRadius: "14px",
    padding: "4px",
    border: "1px solid var(--border)",
    gap: "4px",
  },

  linkInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "12px 16px",
    color: "var(--primary)",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
    width: "0",
  },

  copyBtn: {
    background: "var(--text-primary)",
    color: "var(--bg)",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  hint: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "16px",
    fontStyle: "italic",
  },

  toast: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--primary)",
    color: "var(--bg)",
    padding: "12px 24px",
    borderRadius: "50px",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    zIndex: 1000,
  },
};

export default ShareTrip;
