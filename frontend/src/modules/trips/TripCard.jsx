import { Link } from "react-router-dom";

function TripCard({ trip, onDelete }) {
  return (
    <div style={styles.card}>
      <h3>{trip.title}</h3>

      <p>
        {new Date(trip.startDate).toDateString()} →{" "}
        {new Date(trip.endDate).toDateString()}
      </p>

      <div style={styles.actions}>
        <Link to={`/trips/${trip.id}`}>
          <button>Open</button>
        </Link>

        <button onClick={() => onDelete(trip.id)} style={styles.delete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "6px",
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

export default TripCard;
