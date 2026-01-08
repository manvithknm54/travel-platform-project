import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function CreateTrip() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/trips", {
        title,
        description,
        startDate,
        endDate,
      });

      navigate("/"); // back to dashboard
    } catch (err) {
      alert("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Trip</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Trip Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>
          Start Date *
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date *
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
};

export default CreateTrip;
