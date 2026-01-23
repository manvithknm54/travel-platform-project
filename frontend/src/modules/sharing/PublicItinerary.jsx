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

  if (loading)
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>
          Fetching adventure details...
        </p>
      </div>
    );

  if (!trip)
    return (
      <div style={styles.loadingWrapper}>
        <p style={styles.errorText}>
          ⚠️ Itinerary no longer available or link is invalid.
        </p>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.maxContainer}>
        {/* Brand Badge */}
        <div style={styles.brandBadge}>
          Shared via <strong>Safarify</strong>
        </div>

        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>{trip.title}</h1>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>
              🗓️{" "}
              {new Date(trip.startDate).toLocaleDateString()} —{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span style={styles.metaItem}>
              📍 {trip.stops?.length} Destinations
            </span>
          </div>
        </header>

        {/* Timeline */}
        <div style={styles.timeline}>
          {trip.stops.map((stop, sIdx) => (
            <div key={stop.id} style={styles.stopSection}>
              <div style={styles.cityHeader}>
                <div style={styles.cityMarker}>{sIdx + 1}</div>
                <h2 style={styles.cityName}>
                  {stop.city.name}
                </h2>
              </div>

              <div style={styles.dayGrid}>
                {groupByDay(stop.activities).map(
                  ([day, acts]) => (
                    <div key={day} style={styles.dayCard}>
                      <div style={styles.dayLabel}>
                        Day {day}
                      </div>

                      <div style={styles.activityColumn}>
                        {acts.map((a) => (
                          <div
                            key={a.id}
                            style={styles.activityItem}
                          >
                            <div style={styles.activityInfo}>
                              <span
                                style={styles.activityTitle}
                              >
                                {a.activity.title}
                              </span>
                              {a.activity.description && (
                                <p
                                  style={styles.activityDesc}
                                >
                                  {a.activity.description}
                                </p>
                              )}
                            </div>

                            <div style={styles.activityCost}>
                              ₹
                              {a.activity.cost.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <footer style={styles.footer}>
          <p>
            Plan your own expedition at{" "}
            <strong>Safarify.com</strong>
          </p>
        </footer>
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
  return Object.entries(map).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );
}

/* ================= THEME-AWARE PUBLIC STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "80px 20px",
    color: "var(--text-primary)",
    fontFamily: "'Inter', sans-serif",
  },

  maxContainer: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  brandBadge: {
    background: "rgba(22, 101, 52, 0.1)",
    border: "1px solid rgba(22, 101, 52, 0.2)",
    color: "var(--primary)",
    padding: "8px 16px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "500",
    width: "fit-content",
    margin: "0 auto 32px auto",
    letterSpacing: "0.5px",
  },

  header: {
    textAlign: "center",
    marginBottom: "60px",
  },

  title: {
    fontSize: "48px",
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: "0 0 16px 0",
    color: "var(--text-primary)",
  },

  metaRow: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
  },

  timeline: {
    position: "relative",
    borderLeft: "2px dashed var(--border)",
    marginLeft: "16px",
    paddingLeft: "40px",
  },

  stopSection: {
    marginBottom: "64px",
  },

  cityHeader: {
    position: "relative",
    marginBottom: "28px",
  },

  cityMarker: {
    position: "absolute",
    left: "-58px",
    top: "0",
    width: "34px",
    height: "34px",
    background: "var(--primary)",
    color: "var(--bg)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "800",
    boxShadow: "0 0 20px rgba(0,0,0,0.25)",
  },

  cityName: {
    fontSize: "28px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  dayGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  dayCard: {
    background: "var(--surface)",
    borderRadius: "24px",
    padding: "28px",
    border: "1px solid var(--border)",
  },

  dayLabel: {
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "var(--primary)",
    marginBottom: "20px",
  },

  activityColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "var(--bg)",
    borderRadius: "14px",
    border: "1px solid var(--border)",
  },

  activityTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },

  activityDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: "4px 0 0 0",
    lineHeight: "1.5",
  },

  activityCost: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--primary)",
    fontFamily: "monospace",
  },

  footer: {
    textAlign: "center",
    padding: "40px 0",
    borderTop: "1px solid var(--border)",
    marginTop: "40px",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },

  loadingWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg)",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--border)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "var(--text-secondary)",
    marginTop: "16px",
  },

  errorText: {
    color: "#EF4444",
    fontWeight: "600",
  },
};

export default PublicItinerary;
