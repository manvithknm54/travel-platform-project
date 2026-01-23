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
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    const tripRes = await apiClient.get(`/trips/${tripId}`);
    const itineraryRes = await apiClient.get(`/itinerary/trip/${tripId}`);

    const start = new Date(tripRes.data.startDate);
    const end = new Date(tripRes.data.endDate);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTripStartDate(start);
    setTotalDays(days);
    setStops(itineraryRes.data);
  };

  const usedDays = stops.flatMap((s) => {
    const start =
      Math.floor((new Date(s.startDate) - tripStartDate) / (1000 * 60 * 60 * 24)) + 1;
    const end =
      Math.floor((new Date(s.endDate) - tripStartDate) / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  useEffect(() => {
    if (!query) {
      setCities([]);
      return;
    }
    apiClient
      .get("/cities", { params: { q: query } })
      .then((res) => {
        const addedCityIds = stops.map((s) => s.city.id);
        setCities(res.data.filter((c) => !addedCityIds.includes(c.id)));
      })
      .catch(() => setCities([]));
  }, [query, stops]);

  const isValidRange = () => {
    const s = Number(startDay);
    const e = Number(endDay);
    if (!s || !e || s > e) return false;
    for (let d = s; d <= e; d++) {
      if (usedDays.includes(d)) return false;
    }
    return true;
  };

  const addCity = async (city) => {
    setMessage("");
    setError("");

    if (!isValidRange()) {
      setError("Overlapping days or invalid range.");
      return;
    }

    const startDate = new Date(tripStartDate);
    startDate.setDate(startDate.getDate() + Number(startDay) - 1);
    const endDate = new Date(tripStartDate);
    endDate.setDate(endDate.getDate() + Number(endDay) - 1);

    try {
      await apiClient.post(`/itinerary/trip/${tripId}/stops`, {
        cityId: city.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        order: stops.length + 1,
      });
      setMessage(`"${city.name}" added successfully.`);
      setQuery("");
      setStartDay("");
      setEndDay("");
      loadData();
    } catch {
      setError("Failed to add city.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.title}>Add Destinations</h3>
        <p style={styles.subtitle}>
          Select the cities for your {totalDays}-day safari
        </p>
      </header>

      {/* SUCCESS & ERROR MESSAGES (Maintained current position) */}
      {message && <div style={styles.successBanner}>✨ {message}</div>}
      {error && <div style={styles.errorToast}>⚠ {error}</div>}

      {/* CENTRALIZED SEARCH & DATE MANAGER */}
      <div style={styles.searchContainer}>
        <input
          style={{
            ...styles.searchInput,
            borderColor: isInputFocused ? "var(--primary)" : "var(--border)",
          }}
          type="text"
          placeholder="Search for a city (e.g. Nairobi, Kyoto...)"
          value={query}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div style={styles.dateSelectorBar}>
          <div style={styles.dateField}>
            <label style={styles.miniLabel}>Arrival</label>
            <select
              style={styles.select}
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
            >
              <option value="">Day</option>
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d} disabled={usedDays.includes(d)}>
                  Day {d} {usedDays.includes(d) ? "(Booked)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.dateField}>
            <label style={styles.miniLabel}>Departure</label>
            <select
              style={styles.select}
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
            >
              <option value="">Day</option>
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d} disabled={usedDays.includes(d)}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT (3 columns, horizontal cards) */}
      <div style={styles.resultsGrid}>
        {cities.map((city) => (
          <div key={city.id} style={styles.cityCard}>
            <div style={styles.cardInfo}>
              <span style={styles.cityName}>{city.name}</span>
              <span style={styles.cityCountry}>{city.country || "Global Destination"}</span>
            </div>
            
            <button
              style={{
                ...styles.addBtn,
                opacity: (!startDay || !endDay) ? 0.5 : 1,
              }}
              onClick={() => addCity(city)}
              disabled={!startDay || !endDay}
            >
              Add City
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { background: "transparent" },
  header: { marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: 0 },
  subtitle: { color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" },

  /* Messages */
  successBanner: {
    background: "rgba(22, 101, 52, 0.15)",
    color: "var(--primary)",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "700",
    border: "1px solid rgba(22, 101, 52, 0.2)",
    boxShadow: "0 10px 25px -10px rgba(22, 101, 52, 0.4)",
  },
  errorToast: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#EF4444",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },

  /* Centralized Manager UX */
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
    background: "var(--surface)",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
  },
  searchInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  dateSelectorBar: {
    display: "flex",
    gap: "12px",
  },
  dateField: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  miniLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: "800",
    paddingLeft: "4px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    outline: "none",
    cursor: "pointer",
  },

  /* Grid Layout */
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    maxHeight: "600px",
    overflowY: "auto",
    paddingRight: "8px",
  },
  cityCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    background: "var(--surface)",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    minHeight: "140px",
  },
  cardInfo: {
    display: "flex",
    flexDirection: "column",
  },
  cityName: {
    fontSize: "18px",
    fontWeight: "800",
    color: "var(--text-primary)",
    marginBottom: "2px",
  },
  cityCountry: {
    fontSize: "11px",
    color: "var(--primary)", // Changed to primary for high-value UX look
    fontWeight: "600",
    textTransform: "uppercase",
  },
  addBtn: {
    background: "var(--primary)",
    color: "var(--bg)",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "12px",
  },
};

export default CitySearch;