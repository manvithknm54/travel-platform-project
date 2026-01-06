import { useEffect, useState } from "react";
import { fetchItinerary, addStop, addActivity } from "./itinerary.api";
import ItineraryView from "./ItineraryView";

function ItineraryBuilder({ tripId }) {
  const [stops, setStops] = useState([]);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadItinerary = async () => {
    const data = await fetchItinerary(tripId);
    setStops(data);
  };

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    await addStop(tripId, { city, startDate, endDate });
    setCity("");
    setStartDate("");
    setEndDate("");
    loadItinerary();
  };

  return (
    <div>
      <h2>Build Itinerary</h2>

      <form onSubmit={handleAddStop} style={styles.form}>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button type="submit">Add Stop</button>
      </form>

      <ItineraryView stops={stops} />
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
};

export default ItineraryBuilder;
