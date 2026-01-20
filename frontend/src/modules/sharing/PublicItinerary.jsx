import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";

function PublicItinerary() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicTrip();
  }, [token]);

  const loadPublicTrip = async () => {
    try {
      const res = await apiClient.get(`/shares/public/${token}`);
      setTrip(res.data);
    } catch (err) {
      console.error("Failed to load public trip");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Fetching adventure details...</p>
    </div>
  );

  if (!trip) return (
    <div style={styles.loadingWrapper}>
      <p style={styles.errorText}>⚠️ Itinerary no longer available or link is invalid.</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.maxContainer}>
        {/* Floating "Created with" Badge */}
        <div style={styles.brandBadge}>Shared via TripPlanner</div>

        {/* Hero Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>{trip.title}</h1>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>🗓️ {new Date(trip.startDate).toDateString()} — {new Date(trip.endDate).toDateString()}</span>
            <span style={styles.metaItem}>📍 {trip.stops?.length} Destinations</span>
          </div>
        </header>

        {/* Itinerary Timeline */}
        <div style={styles.timeline}>
          {trip.stops.map((stop, sIdx) => (
            <div key={stop.id} style={styles.stopSection}>
              <div style={styles.cityHeader}>
                <div style={styles.cityMarker}>{sIdx + 1}</div>
                <h2 style={styles.cityName}>{stop.city.name}</h2>
              </div>

              <div style={styles.dayGrid}>
                {groupByDay(stop.activities).map(([day, acts]) => (
                  <div key={day} style={styles.dayCard}>
                    <div style={styles.dayLabel}>Day {day}</div>
                    <div style={styles.activityColumn}>
                      {acts.map((a) => (
                        <div key={a.id} style={styles.activityItem}>
                          <div style={styles.activityInfo}>
                            <span style={styles.activityTitle}>{a.activity.title}</span>
                            {a.activity.description && (
                                <p style={styles.activityDesc}>{a.activity.description}</p>
                            )}
                          </div>
                          <div style={styles.activityCost}>₹{a.activity.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function groupByDay(activities) {
  const map = {};
  activities.forEach((a) => {
    if (!map[a.dayNumber]) map[a.dayNumber] = [];
    map[a.dayNumber].push(a);
  });
  return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0]));
}

/* ================= PREMIUM STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%)",
    padding: "60px 20px",
    color: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  },
  maxContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  brandBadge: {
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    color: "#818cf8",
    padding: "6px 14px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    width: "fit-content",
    margin: "0 auto 20px auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "-1.5px",
    margin: "0 0 10px 0",
    background: "linear-gradient(to bottom, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  metaRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    color: "#64748b",
    fontSize: "15px",
  },
  timeline: {
    position: "relative",
    borderLeft: "2px dashed rgba(255,255,255,0.1)",
    marginLeft: "20px",
    paddingLeft: "30px",
  },
  stopSection: {
    marginBottom: "60px",
  },
  cityHeader: {
    position: "relative",
    marginBottom: "24px",
  },
  cityMarker: {
    position: "absolute",
    left: "-47px",
    top: "0",
    width: "32px",
    height: "32px",
    background: "#6366f1",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
  },
  cityName: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
  },
  dayGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  dayCard: {
    background: "rgba(30, 41, 59, 0.3)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  dayLabel: {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#6366f1",
    marginBottom: "16px",
  },
  activityColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "14px",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.03)",
  },
  activityTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  activityDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  activityCost: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#4ade80",
    background: "rgba(74, 222, 128, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  loadingWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99, 102, 241, 0.1)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: { color: "#64748b", marginTop: "16px" },
  errorText: { color: "#f87171", fontWeight: "500" },
};

export default PublicItinerary;