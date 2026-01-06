import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "./trips.api";

const CreateTrip = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTrip(form);          // ✅ backend call
      navigate("/my-trips");           // ✅ THIS IS THE KEY LINE
    } catch (err) {
      console.error(
        "Create trip failed:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Trip name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <button type="submit">Create Trip</button>
    </form>
  );
};

export default CreateTrip;
