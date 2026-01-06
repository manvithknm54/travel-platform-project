import apiClient from "../../services/apiClient";

export const fetchItinerary = async (tripId) => {
  const response = await apiClient.get(`/itinerary/${tripId}`);
  return response.data;
};

export const addStop = async (tripId, payload) => {
  const response = await apiClient.post(`/itinerary/${tripId}/stops`, payload);
  return response.data;
};

export const addActivity = async (stopId, payload) => {
  const response = await apiClient.post(`/itinerary/stops/${stopId}/activities`, payload);
  return response.data;
};
