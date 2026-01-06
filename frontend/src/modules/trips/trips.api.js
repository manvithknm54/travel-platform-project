import apiClient from "../../services/apiClient";

export const createTrip = (data) => {
  const payload = {
    title: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description,
  };
  return apiClient.post("/trips", payload);
};


export const fetchTrips = async () => {
  const response = await apiClient.get("/trips");
  return response.data;
};


export const deleteTrip = async (tripId) => {
  const response = await apiClient.delete(`/trips/${tripId}`);
  return response.data;
};
