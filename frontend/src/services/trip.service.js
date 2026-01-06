import api from "./api";

export const createTrip = (data) =>
  api.post("/trips", data);

export const getTrips = () =>
  api.get("/trips");

export const getTrip = (id) =>
  api.get(`/trips/${id}`);

