import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function BudgetView({ tripId }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/budgets/trip/${tripId}`)
      .then((res) => {
        if (!res.data || res.data.totalCost === 0) {
          setBudget(null);
        } else {
          setBudget(res.data);
        }
      })
      .catch(() => setBudget(null))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <p>Loading budget...</p>;

  if (!budget) {
    return (
      <p style={{ fontStyle: "italic", color: "#555" }}>
        Budget will be calculated after adding activities.
      </p>
    );
  }

  return (
    <div>
      <h3>Trip Budget Summary</h3>

      <p>
        <strong>Total Cost:</strong> ₹{budget.totalCost}
      </p>

      <p>
        <strong>Average Cost / Day:</strong> ₹
        {budget.averageCostPerDay}
      </p>

      <h4>Cost by City</h4>
      <ul>
        {Object.entries(budget.costByCity).map(
          ([city, cost]) => (
            <li key={city}>
              {city}: ₹{cost}
            </li>
          )
        )}
      </ul>

      <h4>Cost by Day</h4>
      <ul>
        {Object.entries(budget.costByDay).map(
          ([day, cost]) => (
            <li key={day}>
              Day {day}: ₹{cost}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default BudgetView;
