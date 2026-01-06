import apiClient from "../../services/apiClient";

export const fetchPublicTrip = async (publicId) => {
  const response = await apiClient.get(`/share/${publicId}`);
  return response.data;
};

export const copyTrip = async (publicId) => {
  const response = await apiClient.post(`/share/${publicId}/copy`);
  return response.data;
};
