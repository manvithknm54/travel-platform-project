import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function ItineraryView({ tripId }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/itinerary/trip/${tripId}`)
      .then((res) => setStops(res.data))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading)
    return (
      <div style={styles.stateWrapper}>
        <div style={styles.spinnerSmall}></div>
        <p style={styles.stateText}>Syncing your schedule...</p>
      </div>
    );

  if (!stops.length) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📍</div>
        <h4 style={styles.emptyTitle}>Your timeline is quiet</h4>
        <p style={styles.emptyText}>
          Start by adding a city and some activities to your journey.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.mainTitle}>Expedition Timeline</h3>

      {stops.map((stop, index) => (
        <div key={stop.id} style={styles.stopWrapper}>
          {index !== stops.length - 1 && <div style={styles.pathLine} />}

          <div style={styles.cityHeader}>
            <div style={styles.marker}>
              <div style={styles.markerInner} />
            </div>
            <div style={styles.cityInfo}>
              <h4 style={styles.cityName}>{stop.city.name}</h4>
              <p style={styles.cityDates}>
                {new Date(stop.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                —{" "}
                {new Date(stop.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div style={styles.activityContent}>
            {stop.activities.length === 0 ? (
              <div style={styles.noActivities}>
                No activities scheduled for this stop.
              </div>
            ) : (
              groupByDay(stop.activities).map(([day, acts]) => (
                <div key={day} style={styles.dayGroup}>
                  <div style={styles.dayLabel}>Day {day}</div>
                  <div style={styles.activitiesList}>
                    {acts.map((a) => (
                      <div key={a.id} style={styles.activityCard}>
                        <div style={styles.actLeft}>
                          <span style={styles.actTitle}>
                            {a.activity.title}
                          </span>
                          <div style={styles.actMeta}>
                            <span style={styles.metaBadge}>
                              🕒 {a.activity.duration}h
                            </span>
                            <span style={styles.metaBadge}>
                              💰 ₹{a.activity.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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

/* ================= THEME-AWARE ITINERARY STYLES ================= */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },

  mainTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--primary)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  stopWrapper: {
    position: "relative",
    paddingBottom: "20px",
  },

  pathLine: {
    position: "absolute",
    left: "11px",
    top: "30px",
    bottom: "-30px",
    width: "2px",
    background: "linear-gradient(to bottom, var(--border), transparent)",
    zIndex: 0,
  },

  cityHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    position: "relative",
    zIndex: 1,
  },

  marker: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "rgba(22, 101, 52, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(22, 101, 52, 0.3)",
  },

  markerInner: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--primary)",
    boxShadow: "0 0 10px var(--primary)",
  },

  cityName: {
    fontSize: "20px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  cityDates: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: "2px 0 0 0",
    fontWeight: "500",
  },

  activityContent: {
    paddingLeft: "40px",
  },

  dayGroup: {
    marginBottom: "24px",
  },

  dayLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "var(--text-primary)",
    background: "var(--border)",
    padding: "4px 10px",
    borderRadius: "6px",
    width: "fit-content",
    marginBottom: "12px",
    textTransform: "uppercase",
  },

  activitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  activityCard: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    padding: "16px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.2s ease",
  },

  actTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text-primary)",
    display: "block",
    marginBottom: "6px",
  },

  actMeta: {
    display: "flex",
    gap: "12px",
  },

  metaBadge: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },

  noActivities: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    fontStyle: "italic",
    padding: "12px",
    border: "1px dashed var(--border)",
    borderRadius: "12px",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyIcon: { fontSize: "40px", marginBottom: "16px" },

  emptyTitle: {
    fontSize: "18px",
    color: "var(--text-primary)",
    marginBottom: "8px",
  },

  emptyText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    maxWidth: "260px",
    margin: "0 auto",
  },

  stateWrapper: { textAlign: "center", padding: "40px" },

  stateText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginTop: "12px",
  },

  spinnerSmall: {
    width: "24px",
    height: "24px",
    border: "2px solid var(--surface)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite",
  },
};

export default ItineraryView;
