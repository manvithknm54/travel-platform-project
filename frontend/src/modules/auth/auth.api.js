import apiClient from "../../services/apiClient";

export const loginUser = async (payload) => {
  const response = await apiClient.post("/auth/login", payload);

  localStorage.setItem("globetrotter_token", response.data.token);

  return response.data;
};

export const signupUser = async (payload) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data;
};
