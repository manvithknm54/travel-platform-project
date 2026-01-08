import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await apiClient.get("/trips");
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await apiClient.delete(`/trips/${tripId}`);
      loadTrips();
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  const today = new Date();

  const ongoingTrips = trips.filter(
    (t) => new Date(t.endDate) >= today
  );

  const completedTrips = trips.filter(
    (t) => new Date(t.endDate) < today
  );

  if (loading) return <p>Loading trips...</p>;

  return (
    <div style={styles.container}>
      <h2>My Trips</h2>

      {/* Create Trip Section */}
      <div style={styles.createSection}>
        <p style={styles.createText}>
          {trips.length === 0
            ? "No trips yet, create one"
            : "Create a new trip"}
        </p>

        <Link to="/create-trip">
          <button>Create New Trip</button>
        </Link>
      </div>

      {/* Ongoing Trips */}
      <h3 style={styles.sectionTitle}>Ongoing Trips</h3>
      {ongoingTrips.length === 0 ? (
        <p>No ongoing trips</p>
      ) : (
        ongoingTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDelete={deleteTrip}
          />
        ))
      )}

      {/* Completed Trips */}
      {completedTrips.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>Recent Trips</h3>
          {completedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={deleteTrip}
            />
          ))}
        </>
      )}
    </div>
  );
}

function TripCard({ trip, onDelete }) {
  return (
    <div style={styles.card}>
      <h4>{trip.title}</h4>
      <p>
        {new Date(trip.startDate).toDateString()} →{" "}
        {new Date(trip.endDate).toDateString()}
      </p>

      <div style={styles.actions}>
        <Link to={`/trips/${trip.id}`}>
          <button>Open</button>
        </Link>

        <button
          onClick={() => onDelete(trip.id)}
          style={styles.delete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  createSection: {
    marginTop: "10px",
    marginBottom: "25px",
  },
  createText: {
    marginBottom: "8px",
    color: "#555",
  },
  sectionTitle: {
    marginTop: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "14px",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  delete: {
    background: "red",
    color: "white",
  },
};

export default TripList;
