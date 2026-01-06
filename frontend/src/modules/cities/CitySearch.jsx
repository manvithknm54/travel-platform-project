import { useState } from "react";
import { searchCities } from "./cities.api";

function CitySearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setCities([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchCities(value);
      setCities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Add City to Trip</h3>

      <input
        placeholder="Type city name..."
        value={query}
        onChange={handleSearch}
      />

      {loading && <p>Searching...</p>}

      <ul style={styles.list}>
        {cities.map((city) => (
          <li
            key={city.id}
            style={styles.item}
            onClick={() => onSelect(city)}
          >
            <strong>{city.name}</strong>, {city.country}
            <span style={styles.meta}>
              Cost Index: {city.costIndex}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "6px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "6px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  meta: {
    display: "block",
    fontSize: "12px",
    color: "#666",
  },
};

export default CitySearch;
