import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function ActivitySearch({ tripId }) {
  const [query, setQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [dayNumber, setDayNumber] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loadingStops, setLoadingStops] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  /* -----------------------------------
     Load stops (cities) for this trip
  ----------------------------------- */
  useEffect(() => {
    setLoadingStops(true);
    apiClient
      .get(`/itinerary/trip/${tripId}`)
      .then((res) => setStops(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load cities for this trip");
      })
      .finally(() => setLoadingStops(false));
  }, [tripId]);

  /* -----------------------------------
     Search activities
  ----------------------------------- */
  useEffect(() => {
    if (!query) {
      setActivities([]);
      return;
    }

    setLoadingActivities(true);
    apiClient
      .get("/activities", { params: { q: query } })
      .then((res) => setActivities(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingActivities(false));
  }, [query]);

  /* -----------------------------------
     Add activity to selected stop
  ----------------------------------- */
  const addActivity = async (activityId) => {
    if (!selectedStop) {
      alert("Please select a city first");
      return;
    }

    try {
      setAdding(true);

      await apiClient.post(
        `/itinerary/stops/${selectedStop}/activities`,
        {
          activityId,
          dayNumber: Number(dayNumber),
        }
      );

      alert("Activity added successfully ✅");

      // 🔑 RESET STATE (THIS FIXES THE BUG)
      setQuery("");
      setActivities([]);
      setDayNumber(1);

    } catch (error) {
      console.error(error);
      alert("Failed to add activity ❌");
    } finally {
      setAdding(false);
    }
  };

  /* -----------------------------------
     UI
  ----------------------------------- */
  return (
    <div>
      <h3>Add Activities</h3>

      {/* Select City */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select City:&nbsp;
          <select
            value={selectedStop}
            onChange={(e) => setSelectedStop(e.target.value)}
            disabled={loadingStops}
          >
            <option value="">-- Select --</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.city.name}
              </option>
            ))}
          </select>
        </label>

        &nbsp;&nbsp;

        <label>
          Day:&nbsp;
          <input
            type="number"
            min="1"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            style={{ width: "60px" }}
          />
        </label>
      </div>

      {/* Search Activities */}
      <input
        type="text"
        placeholder="Search activities..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loadingActivities && <p>Searching activities...</p>}

      <ul style={{ marginTop: "10px" }}>
        {activities.map((activity) => (
          <li key={activity.id} style={styles.activity}>
            <div>
              <strong>{activity.title}</strong>
              <br />
              <small>
                {activity.category} | ₹{activity.cost} | {activity.duration}h
              </small>
            </div>

            <button
              onClick={() => addActivity(activity.id)}
              disabled={adding}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  activity: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
};

export default ActivitySearch;
