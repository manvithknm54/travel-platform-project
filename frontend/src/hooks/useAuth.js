import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../modules/auth/auth.api";
import { setToken, removeToken } from "../services/token.service";

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginUser(credentials);
      setToken(data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details) => {
    try {
      setLoading(true);
      setError(null);

      const data = await signupUser(details);
      setToken(data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return { login, signup, logout, loading, error };
}
