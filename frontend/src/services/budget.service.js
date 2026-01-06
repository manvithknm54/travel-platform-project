import api from "./api";

export const getTripBudget = (tripId) =>
  api.get(`/budgets/trip/${tripId}`);
