import apiClient from "../../services/apiClient";

export const searchActivities = async (query, cityId) => {
  if (!cityId) {
    return [];
  }

  const response = await apiClient.get("/activities", {
    params: {
      q: query,
      cityId,
    },
  });

  return response.data;
};
