import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.post("/auth/login", data);
      localStorage.setItem("globetrooter_token", res.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ FIXED ENDPOINT
      const res = await apiClient.post("/auth/signup", data);

      localStorage.setItem("globetrooter_token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("globetrooter_token");
    navigate("/login");
  };

  return { login, signup, logout, loading, error };
}
