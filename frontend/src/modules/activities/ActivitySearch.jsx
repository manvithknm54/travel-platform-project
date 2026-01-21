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

  /* ================= LOAD TRIP + STOPS ================= */
  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    const tripRes = await apiClient.get(`/trips/${tripId}`);
    const itineraryRes = await apiClient.get(`/itinerary/trip/${tripId}`);

    setTripStartDate(new Date(tripRes.data.startDate));
    setStops(itineraryRes.data);
  };

  /* ================= WHEN CITY CHANGES ================= */
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
    setDayNumber(days[0]); // default to first valid day

    /* Load activities for selected city */
    apiClient
      .get("/activities", {
        params: { cityId: stop.city.id },
      })
      .then((res) => setActivities(res.data))
      .catch(() => setActivities([]));
  }, [selectedStop, stops, tripStartDate]);

  /* ================= ADD ACTIVITY ================= */
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

    setMessage(
      `"${activity.title}" has been added to your trip (Day ${dayNumber})`
    );
  };

  /* ================= UI ================= */
  return (
    <div>
      <h3>Add Activities</h3>

      {message && <p style={styles.message}>{message}</p>}

      {/* City Selection */}
      <label>
        City:
        <select
          value={selectedStop}
          onChange={(e) => {
            setSelectedStop(e.target.value);
            setActivities([]);
          }}
        >
          <option value="">-- Select City --</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.city.name}
            </option>
          ))}
        </select>
      </label>

      {/* Day Selection (ONLY CITY DAYS) */}
      {allowedDays.length > 0 && (
        <label style={{ marginLeft: "10px" }}>
          Day:
          <select
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
          >
            {allowedDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>
      )}

      <br /><br />

      {/* Activities List */}
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

        {selectedStop && activities.length === 0 && (
          <p style={{ opacity: 0.6 }}>
            No activities available for this city.
          </p>
        )}
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
