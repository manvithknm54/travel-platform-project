import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function CitySearch({ tripId }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [existingStops, setExistingStops] = useState([]);

  // Load existing stops to calculate order
  useEffect(() => {
    apiClient
      .get(`/itinerary/trip/${tripId}`)
      .then((res) => setExistingStops(res.data))
      .catch(() => setExistingStops([]));
  }, [tripId]);

  // Search cities
  useEffect(() => {
    if (!query) {
      setCities([]);
      return;
    }

    apiClient
      .get("/cities", { params: { q: query } })
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, [query]);

  const addCityToTrip = async (city) => {
    setMessage("");
    setError("");

    try {
      const order = existingStops.length + 1;

      await apiClient.post(`/itinerary/trip/${tripId}/stops`, {
        cityId: city.id,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        order,
      });

      setMessage(`"${city.name}" has been added to your trip`);
      setQuery("");

      // refresh stops after add
      const updated = await apiClient.get(
        `/itinerary/trip/${tripId}`
      );
      setExistingStops(updated.data);
    } catch (err) {
      console.error(err);
      setError("Failed to add city. Please try again.");
    }
  };

  return (
    <div>
      <h3>Add Cities</h3>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul>
        {cities.map((city) => (
          <li key={city.id} style={styles.item}>
            <div>
              <strong>{city.name}</strong> ({city.country})
            </div>
            <button onClick={() => addCityToTrip(city)}>
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
  success: {
    color: "green",
    marginBottom: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default CitySearch;
