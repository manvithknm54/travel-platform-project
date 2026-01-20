import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [showCreatedMsg, setShowCreatedMsg] = useState(false);

  useEffect(() => {
    loadTrips();
    const created = sessionStorage.getItem("trip_created");
    if (created) {
      setShowCreatedMsg(true);
      sessionStorage.removeItem("trip_created");
      setTimeout(() => setShowCreatedMsg(false), 4000);
    }
  }, []);

  const loadTrips = async () => {
    try {
      const res = await apiClient.get("/trips");
      setTrips(res.data);
    } catch {
      console.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id) => {
    setTripToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/trips/${tripToDelete}`);
      setShowConfirm(false);
      setTripToDelete(null);
      loadTrips();
    } catch {
      setShowConfirm(false);
    }
  };

  const today = new Date();
  const ongoingTrips = trips.filter((t) => new Date(t.endDate) >= today);
  const completedTrips = trips.filter((t) => new Date(t.endDate) < today);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Fetching your adventures...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxContent}>
        {showCreatedMsg && (
          <div style={styles.successBanner}>
            <span style={{ marginRight: '10px' }}>🎉</span> New trip created successfully!
          </div>
        )}

        {showConfirm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>Delete Journey?</h3>
              <p style={styles.modalText}>Are you sure you want to remove this trip? This action cannot be undone.</p>
              <div style={styles.modalActions}>
                <button style={styles.ghostBtn} onClick={() => setShowConfirm(false)}>Go Back</button>
                <button style={styles.dangerBtnLarge} onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>My Journey</h2>
            <p style={styles.subtitle}>Manage and explore your upcoming travels</p>
          </div>
          <Link to="/create-trip" style={{ textDecoration: "none" }}>
            <button style={styles.createBtn}>
               <span style={{ fontSize: '18px', marginRight: '8px' }}>+</span> New Trip
            </button>
          </Link>
        </header>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}><span style={styles.dotOngoing}></span> Ongoing & Upcoming</h3>
          {ongoingTrips.length === 0 ? (
            <div style={styles.emptyCard}>No active trips found. Ready for a new one?</div>
          ) : (
            <div style={styles.grid}>
              {ongoingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={initiateDelete} isOngoing />
              ))}
            </div>
          )}
        </section>

        {completedTrips.length > 0 && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}><span style={styles.dotCompleted}></span> Past Memories</h3>
            <div style={styles.grid}>
              {completedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={initiateDelete} isOngoing={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, onDelete, isOngoing }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      style={{
        ...styles.card,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        borderColor: hover ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.08)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.cardHeader}>
        <h4 style={styles.tripTitle}>{trip.title}</h4>
        <span style={isOngoing ? styles.tagOngoing : styles.tagCompleted}>
          {isOngoing ? "Active" : "Completed"}
        </span>
      </div>
      <p style={styles.date}>
        📅 {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
      <div style={styles.actions}>
        <Link to={`/trips/${trip.id}`} style={{ flex: 1 }}>
          <button style={styles.openBtn}>View Details</button>
        </Link>
        <button onClick={() => onDelete(trip.id)} style={styles.deleteBtn}>🗑️</button>
      </div>
    </div>
  );
}

/* Updated Styles for TripList */
const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)", padding: "40px 20px", fontFamily: "'Inter', sans-serif" },
  maxContent: { maxWidth: "1100px", margin: "0 auto" },
  successBanner: { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", padding: "16px 24px", borderRadius: "16px", marginBottom: "30px", fontWeight: "600", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)", animation: "fadeIn 0.5s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "20px" },
  title: { fontSize: "32px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "-1px" },
  subtitle: { color: "#94a3b8", marginTop: "5px", fontSize: "15px" },
  createBtn: { padding: "12px 24px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "#fff", fontWeight: "600", cursor: "pointer", boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.4)", display: "flex", alignItems: "center" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },
  dotOngoing: { width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 10px #6366f1" },
  dotCompleted: { width: "8px", height: "8px", borderRadius: "50%", background: "#94a3b8" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" },
  card: { background: "rgba(30, 41, 59, 0.4)", backdropFilter: "blur(12px)", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", display: "flex", flexDirection: "column", gap: "16px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  tripTitle: { fontSize: "19px", fontWeight: "700", color: "#f8fafc", margin: 0 },
  tagOngoing: { fontSize: "11px", padding: "4px 10px", borderRadius: "20px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.2)", fontWeight: "600" },
  tagCompleted: { fontSize: "11px", padding: "4px 10px", borderRadius: "20px", background: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.2)", fontWeight: "600" },
  date: { fontSize: "14px", color: "#64748b", margin: 0 },
  actions: { display: "flex", gap: "12px", marginTop: "8px" },
  openBtn: { width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#1e293b", color: "#f1f5f9", fontWeight: "600", cursor: "pointer" },
  deleteBtn: { padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)", background: "transparent", color: "#ef4444", cursor: "pointer" },
  emptyCard: { padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)", color: "#64748b" },
  loadingContainer: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#020617" },
  spinner: { width: "40px", height: "40px", border: "3px solid rgba(99, 102, 241, 0.1)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" },
  loadingText: { color: "#94a3b8", marginTop: "20px" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", borderRadius: "24px", maxWidth: "400px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" },
  modalTitle: { color: "#fff", fontSize: "22px", fontWeight: "700", marginBottom: "12px" },
  modalText: { color: "#94a3b8", lineHeight: "1.6", marginBottom: "24px" },
  modalActions: { display: "flex", gap: "12px", justifyContent: "center" },
  dangerBtnLarge: { background: "#ef4444", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer" },
  ghostBtn: { background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontWeight: "600" },
};

export default TripList;