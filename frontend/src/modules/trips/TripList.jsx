import { useEffect, useState } from "react";
import { fetchTrips, deleteTrip } from "./trips.api";
import TripCard from "./TripCard";

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      setLoading(true); // ✅ IMPORTANT
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      loadTrips(); // ✅ always stay in sync with backend
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;

  return (
    <div>
      <h2>My Trips</h2>
      {trips.length === 0 && <p>No trips created yet.</p>}
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default TripList;
