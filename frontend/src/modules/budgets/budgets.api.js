import apiClient from "../../services/apiClient";

export const fetchBudget = async (tripId) => {
  const response = await apiClient.get(`/budgets/${tripId}`);
  return response.data;
};
