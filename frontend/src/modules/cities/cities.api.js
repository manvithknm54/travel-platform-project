import apiClient from "../../services/apiClient";

export const searchCities = async (query) => {
  const response = await apiClient.get(`/cities?search=${query}`);
  return response.data;
};
