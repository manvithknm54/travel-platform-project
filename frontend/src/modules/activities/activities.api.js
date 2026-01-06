import apiClient from "../../services/apiClient";

export const searchActivities = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/activities?${query}`);
  return response.data;
};
