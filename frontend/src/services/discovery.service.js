import api from "./api";

export const searchCities = (params) =>
  api.get("/cities", { params });

export const searchActivities = (params) =>
  api.get("/activities", { params });
