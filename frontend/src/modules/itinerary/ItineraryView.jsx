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

  if (loading) return <p>Loading itinerary...</p>;

  if (!stops.length) {
    return <p>No itinerary yet. Add cities and activities.</p>;
  }

  return (
    <div>
      <h3>Trip Itinerary</h3>

      {stops.map((stop) => (
        <div key={stop.id} style={styles.stop}>
          <h4>
            {stop.city.name} (
            {new Date(stop.startDate).toDateString()} –{" "}
            {new Date(stop.endDate).toDateString()})
          </h4>

          {stop.activities.length === 0 ? (
            <p>No activities added.</p>
          ) : (
            groupByDay(stop.activities).map(([day, acts]) => (
              <div key={day} style={styles.day}>
                <strong>Day {day}</strong>
                <ul>
                  {acts.map((a) => (
                    <li key={a.id}>
                      {a.activity.title} – ₹{a.activity.cost} (
                      {a.activity.duration}h)
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

// Helper: group activities by day
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

const styles = {
  stop: {
    border: "1px solid #ccc",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
  },
  day: {
    marginLeft: "10px",
    marginTop: "6px",
  },
};

export default ItineraryView;
