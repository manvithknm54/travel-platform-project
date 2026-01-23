import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

import CitySearch from "../cities/CitySearch";
import ActivitySearch from "../activities/ActivitySearch";
import ItineraryView from "../itinerary/ItineraryView";
import BudgetView from "../budgets/BudgetView";
import ShareTrip from "../sharing/ShareTrip";

function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedCity, setSelectedCity] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    apiClient
      .get(`/trips/${tripId}`)
      .then((res) => setTrip(res.data))
      .catch((err) => console.error("Failed to load trip", err));
  }, [tripId]);

  if (!trip) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Assembling your itinerary...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow}></div>

      <div style={styles.maxContainer}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.badge}>Adventure Roadmap</div>
            <h2 style={styles.title}>{trip.title}</h2>
            <div style={styles.metaRow}>
              <span style={styles.dateBadge}>
                <span style={{ color: "var(--primary)", marginRight: "6px" }}>
                  📅
                </span>
                {new Date(trip.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                —{" "}
                {new Date(trip.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span style={styles.separator}>•</span>
              <span style={styles.statusText}>
                <span style={styles.pulseDot}></span> Plan in progress
              </span>
            </div>
          </div>
        </header>

        {/* TABS */}
        <nav style={styles.tabsContainer}>
          <div style={styles.tabsList}>
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    ...styles.tabBtn,
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    background: isActive
                      ? "var(--border)"
                      : isHovered
                      ? "rgba(0,0,0,0.04)"
                      : "transparent",
                  }}
                >
                  <span style={{ fontSize: "16px", marginRight: "8px" }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                  {isActive && <div style={styles.activeIndicator} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* CONTENT */}
        <main style={styles.contentPane}>
          <div style={styles.innerContent}>
            {activeTab === "itinerary" && <ItineraryView tripId={tripId} />}

            {activeTab === "cities" && (
              <CitySearch
                tripId={tripId}
                selectedCity={selectedCity}
                onCitySelect={setSelectedCity}
              />
            )}

            {activeTab === "activities" && (
              <ActivitySearch tripId={tripId} selectedCity={selectedCity} />
            )}

            {activeTab === "budget" && <BudgetView tripId={tripId} />}
            {activeTab === "share" && <ShareTrip tripId={tripId} />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= TAB CONFIG ================= */

const TAB_CONFIG = [
  { key: "itinerary", label: "Itinerary", icon: "🗺️" },
  { key: "cities", label: "Cities", icon: "🏙️" },
  { key: "activities", label: "Activities", icon: "🏂" },
  { key: "budget", label: "Budget", icon: "💰" },
  { key: "share", label: "Share", icon: "🔗" },
];

/* ================= THEME-AWARE STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text-primary)",
    fontFamily: "'Inter', sans-serif",
    padding: "60px 24px",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    width: "50vw",
    height: "50vw",
    background:
      "radial-gradient(circle, rgba(22, 101, 52, 0.06) 0%, rgba(0,0,0,0) 70%)",
    top: "-10%",
    left: "-10%",
    zIndex: 0,
  },
  maxContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    marginBottom: "48px",
  },
  badge: {
    fontSize: "12px",
    fontWeight: "700",
    background: "rgba(22, 101, 52, 0.1)",
    color: "var(--primary)",
    padding: "6px 16px",
    borderRadius: "20px",
    width: "fit-content",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    margin: "16px 0",
    letterSpacing: "-1.5px",
    color: "var(--text-primary)",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    color: "var(--text-secondary)",
  },
  dateBadge: {
    background: "var(--surface)",
    padding: "6px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    fontSize: "14px",
    fontWeight: "500",
  },
  statusText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "var(--primary)",
    borderRadius: "50%",
    boxShadow: "0 0 0 rgba(22, 101, 52, 0.4)",
  },
  tabsContainer: {
    marginBottom: "32px",
    background: "var(--surface)",
    padding: "6px",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    display: "inline-flex",
  },
  tabsList: {
    display: "flex",
    gap: "4px",
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  contentPane: {
    background: "rgba(0,0,0,0.04)",
    borderRadius: "32px",
    border: "1px solid var(--border)",
    backdropFilter: "blur(20px)",
  },
  innerContent: {
    padding: "40px",
  },
  loadingWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid var(--surface)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    color: "var(--text-secondary)",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default TripDetails;
