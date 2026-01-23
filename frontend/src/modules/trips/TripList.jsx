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
            <span style={{ fontSize: "20px" }}>🌿</span>
            Journey added to your collection!
          </div>
        )}

        {showConfirm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalIcon}>⚠️</div>
              <h3 style={styles.modalTitle}>Archive Journey?</h3>
              <p style={styles.modalText}>
                This will permanently remove this adventure from your Safarify
                records.
              </p>
              <div style={styles.modalActions}>
                <button
                  style={styles.ghostBtn}
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  style={styles.dangerBtnLarge}
                  onClick={confirmDelete}
                >
                  Remove Trip
                </button>
              </div>
            </div>
          </div>
        )}

        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Your Collection</h2>
            <p style={styles.subtitle}>
              Curated memories and upcoming expeditions
            </p>
          </div>
          <Link to="/create-trip" style={{ textDecoration: "none" }}>
            <button style={styles.createBtn}>
              <span style={{ fontSize: "18px", marginRight: "8px" }}>+</span>
              New Safari
            </button>
          </Link>
        </header>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.dotOngoing}></span>
            Active Expeditions
          </h3>
          {ongoingTrips.length === 0 ? (
            <div style={styles.emptyCard}>
              Your itinerary is empty. Ready to explore?
            </div>
          ) : (
            <div style={styles.grid}>
              {ongoingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={initiateDelete}
                  isOngoing
                />
              ))}
            </div>
          )}
        </section>

        {completedTrips.length > 0 && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.dotCompleted}></span>
              Past Horizons
            </h3>
            <div style={styles.grid}>
              {completedTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={initiateDelete}
                  isOngoing={false}
                />
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
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        borderColor: hover ? "var(--primary)" : "var(--border)",
        boxShadow: hover
          ? "0 20px 40px -15px rgba(0,0,0,0.7)"
          : "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.cardHeader}>
        <h4 style={styles.tripTitle}>{trip.title}</h4>
        <div style={isOngoing ? styles.tagOngoing : styles.tagCompleted}>
          {isOngoing ? "Active" : "Archived"}
        </div>
      </div>

      <div style={styles.dateWrapper}>
        <span style={{ opacity: 0.6 }}>📅</span>
        <p style={styles.date}>
          {new Date(trip.startDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}{" "}
          —{" "}
          {new Date(trip.endDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div style={styles.actions}>
        <Link
          to={`/trips/${trip.id}`}
          style={{ flex: 1, textDecoration: "none" }}
        >
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              ...styles.openBtn,
              background: btnHover
                ? "var(--primary)"
                : "var(--bg)",
              color: btnHover
                ? "var(--bg)"
                : "var(--text-primary)",
            }}
          >
            Explore Plan
          </button>
        </Link>
        <button
          onClick={() => onDelete(trip.id)}
          style={styles.deleteBtn}
        >
          <span style={{ opacity: 0.7 }}>🗑️</span>
        </button>
      </div>
    </div>
  );
}

/* ================= THEME-AWARE STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "60px 24px",
    fontFamily: "'Inter', sans-serif",
  },
  maxContent: { maxWidth: "1100px", margin: "0 auto" },

  successBanner: {
    background: "var(--surface)",
    color: "var(--primary)",
    padding: "16px 24px",
    borderRadius: "16px",
    marginBottom: "32px",
    fontWeight: "700",
    border: "1px solid var(--primary)",
    boxShadow: "0 10px 30px -10px rgba(22, 101, 52, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "60px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "32px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
    letterSpacing: "-1.5px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "8px",
    fontSize: "16px",
  },

  createBtn: {
    padding: "14px 28px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(22, 101, 52, 0.4)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  },

  section: { marginBottom: "56px" },
  sectionTitle: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "2.5px",
    color: "var(--text-secondary)",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "700",
  },

  dotOngoing: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "var(--primary)",
    boxShadow: "0 0 12px var(--primary)",
  },
  dotCompleted: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "var(--border)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "32px",
  },

  card: {
    background: "var(--surface)",
    padding: "28px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  tripTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: "1.2",
  },

  tagOngoing: {
    fontSize: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    background: "rgba(22, 101, 52, 0.1)",
    color: "var(--primary)",
    border: "1px solid rgba(22, 101, 52, 0.2)",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  tagCompleted: {
    fontSize: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    background: "rgba(87, 83, 78, 0.1)",
    color: "var(--text-secondary)",
    border: "1px solid rgba(87, 83, 78, 0.2)",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  dateWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  date: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
    fontWeight: "500",
  },

  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "8px",
  },
  openBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  emptyCard: {
    padding: "60px",
    textAlign: "center",
    background: "var(--surface)",
    borderRadius: "24px",
    border: "2px dashed var(--border)",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },

  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid var(--surface)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "var(--text-secondary)",
    marginTop: "24px",
    fontWeight: "600",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    padding: "40px",
    borderRadius: "32px",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 30px 60px -12px rgba(0,0,0,0.8)",
  },
  modalIcon: { fontSize: "48px", marginBottom: "20px" },
  modalTitle: {
    color: "var(--text-primary)",
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "12px",
    letterSpacing: "-1px",
  },
  modalText: {
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    marginBottom: "32px",
    fontSize: "15px",
  },
  modalActions: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  dangerBtnLarge: {
    background: "#EF4444",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.3)",
  },
  ghostBtn: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    padding: "14px",
  },
};

export default TripList;
