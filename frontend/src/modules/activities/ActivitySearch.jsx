import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function ActivitySearch({ tripId }) {
  const [query, setQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [dayNumber, setDayNumber] = useState(1);
  const [maxDays, setMaxDays] = useState(1);
  const [message, setMessage] = useState("");

  // Load trip + stops
  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    const tripRes = await apiClient.get(`/trips/${tripId}`);
    const itineraryRes = await apiClient.get(`/itinerary/trip/${tripId}`);

    const start = new Date(tripRes.data.startDate);
    const end = new Date(tripRes.data.endDate);

    const totalDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setMaxDays(totalDays);
    setStops(itineraryRes.data);
  };

  // Search activities
  useEffect(() => {
    if (!query) {
      setActivities([]);
      return;
    }

    apiClient
      .get("/activities", { params: { q: query } })
      .then((res) => setActivities(res.data));
  }, [query]);

  const addActivity = async (activity) => {
    if (!selectedStop) {
      setMessage("Please select a city first");
      return;
    }

    await apiClient.post(
      `/itinerary/stops/${selectedStop}/activities`,
      {
        activityId: activity.id,
        dayNumber,
      }
    );

    setMessage(
      `"${activity.title}" has been added to your trip (Day ${dayNumber})`
    );
    setQuery("");
  };

  return (
    <div>
      <h3>Add Activities</h3>

      {message && <p style={styles.message}>{message}</p>}

      {/* City Selection */}
      <label>
        City:
        <select
          value={selectedStop}
          onChange={(e) => setSelectedStop(e.target.value)}
        >
          <option value="">-- Select City --</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.city.name}
            </option>
          ))}
        </select>
      </label>

      {/* Day Selection */}
      <label style={{ marginLeft: "10px" }}>
        Day:
        <select
          value={dayNumber}
          onChange={(e) => setDayNumber(Number(e.target.value))}
        >
          {Array.from({ length: maxDays }, (_, i) => i + 1).map(
            (day) => (
              <option key={day} value={day}>
                {day}
              </option>
            )
          )}
        </select>
      </label>

      <br /><br />

      {/* Search */}
      <input
        type="text"
        placeholder="Search activities..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul>
        {activities.map((activity) => (
          <li key={activity.id} style={styles.item}>
            <div>
              <strong>{activity.title}</strong> | ₹{activity.cost}
            </div>
            <button onClick={() => addActivity(activity)}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    borderBottom: "1px solid #ddd",
    padding: "6px",
  },
  message: {
    color: "green",
    marginBottom: "10px",
  },
};

export default ActivitySearch;
