import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function ActivitySearch({ tripId }) {
  const [activities, setActivities] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [allowedDays, setAllowedDays] = useState([]);
  const [dayNumber, setDayNumber] = useState("");
  const [tripStartDate, setTripStartDate] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    const tripRes = await apiClient.get(`/trips/${tripId}`);
    const itineraryRes = await apiClient.get(`/itinerary/trip/${tripId}`);

    setTripStartDate(new Date(tripRes.data.startDate));
    setStops(itineraryRes.data);
  };

  useEffect(() => {
    if (!selectedStop || !tripStartDate) {
      setAllowedDays([]);
      setDayNumber("");
      return;
    }

    const stop = stops.find((s) => s.id === selectedStop);
    if (!stop) return;

    const startDay =
      Math.floor(
        (new Date(stop.startDate) - tripStartDate) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const endDay =
      Math.floor(
        (new Date(stop.endDate) - tripStartDate) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const days = Array.from(
      { length: endDay - startDay + 1 },
      (_, i) => startDay + i
    );

    setAllowedDays(days);
    setDayNumber(days[0]);

    apiClient
      .get("/activities", { params: { cityId: stop.city.id } })
      .then((res) => setActivities(res.data))
      .catch(() => setActivities([]));
  }, [selectedStop, stops, tripStartDate]);

  const addActivity = async (activity) => {
    if (!selectedStop || !dayNumber) {
      setMessage("Please select city and day");
      return;
    }

    await apiClient.post(
      `/itinerary/stops/${selectedStop}/activities`,
      {
        activityId: activity.id,
        dayNumber,
      }
    );

    setMessage(`"${activity.title}" added to Day ${dayNumber}`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.title}>Curate Experiences</h3>
        <p style={styles.subtitle}>
          Discover and add unique activities to your stops.
        </p>
      </header>

      {message && (
        <div style={styles.successBanner}>✨ {message}</div>
      )}

      <div style={styles.selectionBar}>
        <div style={styles.selectField}>
          <label style={styles.label}>Destination</label>
          <select
            style={styles.select}
            value={selectedStop}
            onChange={(e) => {
              setSelectedStop(e.target.value);
              setActivities([]);
            }}
          >
            <option value="">-- Choose a City --</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.city.name}
              </option>
            ))}
          </select>
        </div>

        {allowedDays.length > 0 && (
          <div style={styles.selectField}>
            <label style={styles.label}>Scheduled Day</label>
            <select
              style={styles.select}
              value={dayNumber}
              onChange={(e) =>
                setDayNumber(Number(e.target.value))
              }
            >
              {allowedDays.map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={styles.activityGrid}>
        {activities.map((activity) => (
          <div key={activity.id} style={styles.activityCard}>
            <div style={styles.cardInfo}>
              <h4 style={styles.actTitle}>
                {activity.title}
              </h4>
              <div style={styles.tagRow}>
                <span style={styles.costTag}>
                  ₹{activity.cost}
                </span>
                <span style={styles.durationTag}>
                  🕒 {activity.duration || 2}h
                </span>
              </div>
            </div>
            <button
              style={styles.addBtn}
              onClick={() => addActivity(activity)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {!selectedStop && (
        <div style={styles.emptyState}>
          <p>Please select a city to see available activities.</p>
        </div>
      )}

      {selectedStop && activities.length === 0 && (
        <div style={styles.emptyState}>
          <p>
            No special activities found for this location yet.
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= THEME-AWARE ACTIVITY STYLES ================= */

const styles = {
  container: { background: "transparent" },
  header: { marginBottom: "32px" },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginTop: "4px",
  },

  successBanner: {
    background: "rgba(22, 101, 52, 0.15)",
    color: "var(--primary)",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "700",
    border: "1px solid rgba(22, 101, 52, 0.2)",
  },

  selectionBar: {
    display: "flex",
    gap: "20px",
    background: "var(--surface)",
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    marginBottom: "32px",
  },

  selectField: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--text-secondary)",
    fontWeight: "700",
  },

  select: {
    padding: "12px",
    borderRadius: "12px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "14px",
  },

  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },

  activityCard: {
    background: "var(--surface)",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "16px",
    transition: "transform 0.2s ease",
  },

  actTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
    lineHeight: "1.4",
  },

  tagRow: { display: "flex", gap: "10px" },

  costTag: {
    fontSize: "12px",
    color: "var(--primary)",
    fontWeight: "700",
    background: "rgba(22, 101, 52, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  durationTag: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    background: "var(--bg)",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  addBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "var(--text-primary)",
    color: "var(--bg)",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--text-secondary)",
    fontSize: "15px",
    border: "2px dashed var(--border)",
    borderRadius: "24px",
  },
};

export default ActivitySearch;
