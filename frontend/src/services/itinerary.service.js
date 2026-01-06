import api from "./api";

export const addStop = (tripId, data) =>
  api.post(`/itineraries/${tripId}/stops`, data);

export const addActivity = (stopId, data) =>
  api.post(`/itineraries/stops/${stopId}/activities`, data);
