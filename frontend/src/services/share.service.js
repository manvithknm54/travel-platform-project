import api from "./api";

export const createShareLink = (tripId) =>
  api.post(`/shares/trip/${tripId}`);

export const getPublicTrip = (token) =>
  api.get(`/shares/public/${token}`);
