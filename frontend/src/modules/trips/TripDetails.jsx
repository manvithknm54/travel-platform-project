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
      <div style={styles.maxContainer}>
        {/* Header Section */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.badge}>Trip Overview</div>
            <h2 style={styles.title}>{trip.title}</h2>
            <div style={styles.metaRow}>
              <span style={styles.dateBadge}>
                📅 {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </span>
              <span style={styles.separator}>•</span>
              <span style={styles.statusText}>Plan in progress</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav style={styles.tabsContainer}>
          <div style={styles.tabs}>
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    ...styles.tabBtn,
                    ...(isActive ? styles.activeTab : {}),
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                  {tab.label}
                  {isActive && <div style={styles.activeIndicator} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Pane */}
        <main style={styles.contentPane}>
          <div style={styles.innerContent}>
            {activeTab === "itinerary" && <ItineraryView tripId={tripId} />}
            {activeTab === "cities" && <CitySearch tripId={tripId} />}
            {activeTab === "activities" && <ActivitySearch tripId={tripId} />}
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

/* ================= PREMIUM DARK THEME STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#f8fafc",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "40px 20px",
  },
  maxContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "40px",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  badge: {
    width: "fit-content",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    background: "rgba(99, 102, 241, 0.1)",
    color: "#818cf8",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-1px",
    background: "linear-gradient(to right, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#64748b",
    fontSize: "15px",
  },
  dateBadge: {
    background: "rgba(255,255,255,0.03)",
    padding: "4px 10px",
    borderRadius: "8px",
  },
  tabsContainer: {
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    paddingBottom: "1px", // for indicator
  },
  tabBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  activeTab: {
    color: "#fff",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#6366f1",
    borderRadius: "2px 2px 0 0",
    boxShadow: "0 -4px 10px rgba(99, 102, 241, 0.5)",
  },
  contentPane: {
    background: "rgba(30, 41, 59, 0.3)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  innerContent: {
    padding: "32px",
  },
  loadingWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99, 102, 241, 0.1)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "14px",
  }
};

export default TripDetails;