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
    <div>
      <h3>Share Trip</h3>

      <button onClick={generateLink} disabled={loading}>
        {loading ? "Generating..." : "Generate Share Link"}
      </button>

      {shareUrl && (
        <div style={styles.linkBox}>
          <input type="text" value={shareUrl} readOnly />
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      )}

      {copied && (
        <div style={styles.toast}>
          Link copied to clipboard
        </div>
      )}
    </div>
  );
}

const styles = {
  linkBox: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },
  toast: {
    marginTop: "8px",
    background: "#e6fffa",
    color: "#065f46",
    padding: "6px",
    borderRadius: "4px",
  },
};

export default ShareTrip;
