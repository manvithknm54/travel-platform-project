import { useState } from "react";
import apiClient from "../../services/apiClient";

function ShareTrip({ tripId }) {
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post(`/shares/trip/${tripId}`);
      setShareUrl(res.data.shareUrl);
    } catch (err) {
      alert("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard");
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
    </div>
  );
}

const styles = {
  linkBox: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },
};

export default ShareTrip;
