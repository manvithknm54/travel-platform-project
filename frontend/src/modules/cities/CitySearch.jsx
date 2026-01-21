import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function CitySearch({ tripId }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [stops, setStops] = useState([]);
  const [tripStartDate, setTripStartDate] = useState(null);
  const [totalDays, setTotalDays] = useState(1);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ================= LOAD TRIP + STOPS ================= */
  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    const tripRes = await apiClient.get(`/trips/${tripId}`);
    const itineraryRes = await apiClient.get(`/itinerary/trip/${tripId}`);

    const start = new Date(tripRes.data.startDate);
    const end = new Date(tripRes.data.endDate);

    const days =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTripStartDate(start);
    setTotalDays(days);
    setStops(itineraryRes.data);
  };

  /* ================= USED DAYS ================= */
  const usedDays = stops.flatMap((s) => {
    const start = Math.floor(
      (new Date(s.startDate) - tripStartDate) /
        (1000 * 60 * 60 * 24)
    ) + 1;
    const end = Math.floor(
      (new Date(s.endDate) - tripStartDate) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  /* ================= SEARCH CITIES ================= */
  useEffect(() => {
    if (!query) {
      setCities([]);
      return;
    }

    apiClient
      .get("/cities", { params: { q: query } })
      .then((res) => {
        const addedCityIds = stops.map((s) => s.city.id);
        setCities(
          res.data.filter((c) => !addedCityIds.includes(c.id))
        );
      })
      .catch(() => setCities([]));
  }, [query, stops]);

  /* ================= VALIDATE DAY RANGE ================= */
  const isValidRange = () => {
    const s = Number(startDay);
    const e = Number(endDay);
    if (!s || !e || s > e) return false;

    for (let d = s; d <= e; d++) {
      if (usedDays.includes(d)) return false;
    }
    return true;
  };

  /* ================= ADD CITY ================= */
  const addCity = async (city) => {
    setMessage("");
    setError("");

    if (!isValidRange()) {
      setError("Selected days overlap with another city.");
      return;
    }

    const startDate = new Date(tripStartDate);
    startDate.setDate(startDate.getDate() + Number(startDay) - 1);

    const endDate = new Date(tripStartDate);
    endDate.setDate(endDate.getDate() + Number(endDay) - 1);

    await apiClient.post(`/itinerary/trip/${tripId}/stops`, {
      cityId: city.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      order: stops.length + 1,
    });

    setMessage(
      `"${city.name}" added (Day ${startDay}–${endDay})`
    );
    setQuery("");
    setStartDay("");
    setEndDay("");
    loadData();
  };

  /* ================= UI ================= */
  return (
    <div>
      <h3>Add City</h3>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ margin: "10px 0" }}>
        <label>
          Start Day:
          <select value={startDay} onChange={(e) => setStartDay(e.target.value)}>
            <option value="">--</option>
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(
              (d) => (
                <option key={d} value={d}>{d}</option>
              )
            )}
          </select>
        </label>

        <label style={{ marginLeft: "10px" }}>
          End Day:
          <select value={endDay} onChange={(e) => setEndDay(e.target.value)}>
            <option value="">--</option>
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(
              (d) => (
                <option key={d} value={d}>{d}</option>
              )
            )}
          </select>
        </label>
      </div>

      <ul>
        {cities.map((city) => (
          <li key={city.id} style={styles.item}>
            <strong>{city.name}</strong>
            <button onClick={() => addCity(city)}>Add</button>
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
    padding: "6px",
    borderBottom: "1px solid #ddd",
  },
};

export default CitySearch;
