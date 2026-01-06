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
      .catch((err) => console.error(err));
  }, [tripId]);

  // 👇 THIS IS THE IMPORTANT CONNECTION
  const handleCitySelect = async (city) => {
    try {
      await apiClient.post(`/itinerary/trip/${tripId}/stops`, {
        cityId: city.id,
        startDate: trip.startDate,
        endDate: trip.startDate,
        order: 1,
      });

      alert(`${city.name} added to trip`);
    } catch (err) {
      console.error(err);
      alert("Failed to add city");
    }
  };

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{trip.title}</h2>
      <p>
        {new Date(trip.startDate).toDateString()} →{" "}
        {new Date(trip.endDate).toDateString()}
      </p>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab("itinerary")}>
          Itinerary
        </button>
        <button onClick={() => setActiveTab("cities")}>
          Add Cities
        </button>
        <button onClick={() => setActiveTab("activities")}>
          Activities
        </button>
        <button onClick={() => setActiveTab("budget")}>
          Budget
        </button>
        <button onClick={() => setActiveTab("share")}>
          Share
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === "itinerary" && (
          <ItineraryView tripId={tripId} />
        )}

        {activeTab === "cities" && (
          <CitySearch onSelect={handleCitySelect} />
        )}

        {activeTab === "activities" && (
          <ActivitySearch tripId={tripId} />
        )}


        {activeTab === "budget" && (
          <BudgetView tripId={tripId} />
        )}

        {activeTab === "share" && (
          <ShareTrip tripId={tripId} />
        )}
      </div>
    </div>
  );
}

const styles = {
  tabs: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  content: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
};

export default TripDetails;
