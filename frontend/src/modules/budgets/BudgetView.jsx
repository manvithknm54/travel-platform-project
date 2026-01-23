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

  if (loading)
    return (
      <div style={styles.stateWrapper}>
        <div style={styles.spinnerSmall}></div>
        <p style={styles.stateText}>Calculating expenses...</p>
      </div>
    );

  if (!budget) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>💎</div>
        <p style={styles.emptyText}>
          Your budget summary will appear here once you've added
          activities to your itinerary.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.title}>Financial Overview</h3>
        <p style={styles.subtitle}>
          Investment details for your upcoming expedition.
        </p>
      </header>

      {/* HERO STATS */}
      <div style={styles.heroCard}>
        <div style={styles.heroStat}>
          <span style={styles.statLabel}>
            Total Expedition Cost
          </span>
          <span style={styles.statValue}>
            ₹{budget.totalCost.toLocaleString()}
          </span>
        </div>

        <div style={styles.divider} />

        <div style={styles.heroStat}>
          <span style={styles.statLabel}>Daily Average</span>
          <span style={styles.statValueSmall}>
            ₹
            {Math.round(
              budget.averageCostPerDay
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <div style={styles.breakdownGrid}>
        {/* COST BY CITY */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            Allocation by City
          </h4>
          <div style={styles.list}>
            {Object.entries(budget.costByCity).map(
              ([city, cost]) => (
                <div key={city} style={styles.listItem}>
                  <span style={styles.itemName}>
                    {city}
                  </span>
                  <span style={styles.itemPrice}>
                    ₹{cost.toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* COST BY DAY */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            Allocation by Day
          </h4>
          <div style={styles.list}>
            {Object.entries(budget.costByDay).map(
              ([day, cost]) => (
                <div key={day} style={styles.listItem}>
                  <span style={styles.itemName}>
                    Day {day}
                  </span>
                  <span style={styles.itemPrice}>
                    ₹{cost.toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= THEME-AWARE BUDGET STYLES ================= */

const styles = {
  container: { background: "transparent" },

  header: { marginBottom: "32px" },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: 0,
  },

  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginTop: "4px",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: "40px",
    boxShadow:
      "0 20px 40px -10px rgba(0,0,0,0.15)",
  },

  heroStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  statLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "var(--primary)",
    fontWeight: "800",
  },

  statValue: {
    fontSize: "42px",
    fontWeight: "800",
    color: "var(--text-primary)",
    letterSpacing: "-1px",
  },

  statValueSmall: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
  },

  divider: {
    width: "1px",
    height: "60px",
    background: "var(--border)",
  },

  breakdownGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "32px",
  },

  section: {
    background: "var(--surface)",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
  },

  sectionTitle: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
    fontWeight: "700",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "12px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: {
    fontSize: "15px",
    color: "var(--text-primary)",
    fontWeight: "500",
  },

  itemPrice: {
    fontSize: "15px",
    color: "var(--primary)",
    fontWeight: "700",
    fontFamily: "monospace",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "var(--surface)",
    borderRadius: "24px",
    border: "1px dashed var(--border)",
  },

  emptyIcon: { fontSize: "32px", marginBottom: "16px" },

  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.6",
    maxWidth: "280px",
    margin: "0 auto",
  },

  stateWrapper: {
    textAlign: "center",
    padding: "40px",
  },

  stateText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginTop: "12px",
  },

  spinnerSmall: {
    width: "24px",
    height: "24px",
    border: "2px solid var(--border)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite",
  },
};

export default BudgetView;
