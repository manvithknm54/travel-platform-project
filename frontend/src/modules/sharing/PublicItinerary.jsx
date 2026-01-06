import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function PublicItinerary() {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();
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

  const handleCopy = () => {
    alert("Login required to copy this trip");
    navigate("/login");
  };

  if (loading) return <p>Loading itinerary...</p>;
  if (!trip) return <p>Itinerary not found.</p>;

  return (
    <div style={styles.container}>
      <h1>{trip.title}</h1>

      <p>
        {new Date(trip.startDate).toDateString()} →{" "}
        {new Date(trip.endDate).toDateString()}
      </p>

      <h2>Itinerary</h2>

      {trip.stops.map((stop) => (
        <div key={stop.id} style={styles.stop}>
          <h3>{stop.city.name}</h3>

          {groupByDay(stop.activities).map(([day, acts]) => (
            <div key={day} style={styles.day}>
              <strong>Day {day}</strong>
              <ul>
                {acts.map((a) => (
                  <li key={a.id}>
                    {a.activity.title} – ₹{a.activity.cost}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Group activities by dayNumber
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
  container: {
    padding: "20px",
  },
  stop: {
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  day: {
    marginLeft: "12px",
    marginTop: "8px",
  },
};

export default PublicItinerary;
