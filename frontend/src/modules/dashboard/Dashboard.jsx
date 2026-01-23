import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CreateTrip from "../trips/CreateTrip";
import TripList from "../trips/TripList";

function Dashboard() {
  const { logout, user } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  return (
    <div style={styles.dashboardWrapper}>
      {/* Premium Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>Safarify</h1>
          <button
            onClick={logout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            style={{
              ...styles.logoutBtn,
              background: isLogoutHovered
                ? "rgba(239, 68, 68, 0.1)"
                : "transparent",
              borderColor: isLogoutHovered
                ? "#EF4444"
                : "var(--border)",
              color: isLogoutHovered
                ? "#EF4444"
                : "var(--text-secondary)",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={styles.mainContent}>
        {/* Welcome Section */}
        <div style={styles.heroSection}>
          <h2 style={styles.greeting}>Welcome back, Explorer</h2>
          <p style={styles.subGreeting}>
            Where will your next adventure take you?
          </p>
        </div>

        {/* Action Section */}
        <section style={styles.actionSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Plan a New Safari</h3>
          </div>
          <CreateTrip onCreated={() => setRefresh(!refresh)} />
        </section>

        {/* List Section */}
        <section style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Your Collections</h3>
            <span style={styles.badge}>Trips</span>
          </div>
          <TripList key={refresh} />
        </section>
      </main>
    </div>
  );
}

/* ================= THEME-AWARE DASHBOARD STYLES ================= */

const styles = {
  dashboardWrapper: {
    minHeight: "100vh",
    backgroundColor: "var(--bg)",
    color: "var(--text-primary)",
    fontFamily: "'Inter', sans-serif",
    paddingTop: "80px",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "70px",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  navContent: {
    width: "100%",
    maxWidth: "1100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    background:
      "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "transparent",
  },

  mainContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },

  heroSection: {
    marginBottom: "48px",
  },

  greeting: {
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
    letterSpacing: "-1px",
  },

  subGreeting: {
    fontSize: "16px",
    color: "var(--text-secondary)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-primary)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  badge: {
    fontSize: "11px",
    backgroundColor: "var(--surface)",
    color: "var(--primary)",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    fontWeight: "700",
  },

  actionSection: {
    background: "var(--surface)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    marginBottom: "40px",
  },

  listSection: {
    marginTop: "20px",
  },
};

export default Dashboard;
